import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import WebSocket, { WebSocketServer } from 'ws';
import { z } from 'zod';
import { env } from '../config/env';
import { ApiError, asyncHandler } from '../utils/http';

const CHAT_EVENT = 'message';
const CHAT_PATH = '/api/chat/socket';
const CHAT_TOPIC_PREFIX = 'storefront-chat';
const CONVERSATION_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

const channelSchema = z.object({
  tenantId: z.string().trim().uuid(),
  conversationId: z.string().trim().regex(CONVERSATION_ID_PATTERN)
});

const chatMessageInputSchema = z.object({
  tenantId: z.string().trim().uuid(),
  conversationId: z.string().trim().regex(CONVERSATION_ID_PATTERN),
  senderId: z.string().trim().min(1).max(100),
  senderName: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(4000),
  metadata: z.record(z.string().max(60), z.string().max(500)).optional()
});

type ChatMessageInput = z.infer<typeof chatMessageInputSchema>;
type ChatMessage = ChatMessageInput & {
  id: string;
  createdAt: string;
};
type Cleanup = () => Promise<void>;
type ChatChannel = ReturnType<typeof supabase.channel>;

const activeCleanups = new Set<Cleanup>();
let chatServer: WebSocketServer | null = null;

function topicFor(tenantId: string, conversationId: string): string {
  return `${CHAT_TOPIC_PREFIX}:${tenantId}:${conversationId}`;
}

function createChatMessage(input: ChatMessageInput): ChatMessage {
  return {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString()
  };
}

function waitForSubscription(channel: ChatChannel, timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Realtime subscription timed out'));
    }, timeoutMs);

    channel.subscribe((status, error) => {
      if (status === 'SUBSCRIBED') {
        clearTimeout(timeout);
        resolve();
        return;
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        clearTimeout(timeout);
        reject(error ?? new Error(`Realtime subscription failed: ${status}`));
      }
    });
  });
}

async function removeChannel(channel: ChatChannel): Promise<void> {
  try {
    await channel.unsubscribe();
  } catch (error) {
    console.error('Failed to unsubscribe Realtime channel', error);
  }

  try {
    await supabase.removeChannel(channel);
  } catch (error) {
    console.error('Failed to remove Realtime channel', error);
  }
}

async function publishChatMessage(topic: string, message: ChatMessage): Promise<void> {
  const channel = supabase.channel(topic, {
    config: {
      broadcast: { self: false }
    }
  });

  try {
    await waitForSubscription(channel);
    const result = await channel.send({
      type: 'broadcast',
      event: CHAT_EVENT,
      payload: message
    });

    if (result !== 'ok') {
      throw new ApiError(502, 'Realtime broadcast failed', { result });
    }
  } finally {
    await removeChannel(channel);
  }
}

export const chatRouter = Router();

chatRouter.post(
  '/messages',
  asyncHandler(async (req, res) => {
    const input = chatMessageInputSchema.parse(req.body);
    const message = createChatMessage(input);

    await publishChatMessage(topicFor(input.tenantId, input.conversationId), message);

    res.status(202).json({ message });
  })
);

export function attachChatWebSocket(server: Server): WebSocketServer {
  if (chatServer) {
    throw new Error('Chat WebSocket server is already attached');
  }

  const wss = new WebSocketServer({
    server,
    path: CHAT_PATH,
    maxPayload: 16 * 1024
  });

  chatServer = wss;

  wss.on('connection', (socket, request) => {
    const url = new URL(request.url ?? CHAT_PATH, 'http://localhost');
    const parsedQuery = channelSchema.safeParse({
      tenantId: url.searchParams.get('tenantId'),
      conversationId: url.searchParams.get('conversationId')
    });

    const send = (message: unknown) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    };

    if (!parsedQuery.success) {
      send({ type: 'chat.error', error: 'Invalid chat channel parameters' });
      socket.close(1008, 'Invalid chat channel parameters');
      return;
    }

    const { tenantId, conversationId } = parsedQuery.data;
    const topic = topicFor(tenantId, conversationId);
    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: true }
      }
    });

    let subscribed = false;
    let cleanedUp = false;

    const cleanup: Cleanup = async () => {
      if (cleanedUp) {
        return;
      }

      cleanedUp = true;
      subscribed = false;
      activeCleanups.delete(cleanup);
      await removeChannel(channel);
    };

    activeCleanups.add(cleanup);

    const handleBroadcast = (event: { payload?: unknown }) => {
      send({ type: 'chat.message', data: event.payload });
    };

    channel.on('broadcast', { event: CHAT_EVENT }, handleBroadcast);

    channel.subscribe((status, error) => {
      if (status === 'SUBSCRIBED') {
        subscribed = true;
        send({ type: 'chat.ready', topic });
        return;
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        send({
          type: 'chat.error',
          error: error?.message ?? `Realtime channel unavailable: ${status}`
        });
        void cleanup().finally(() => {
          socket.close(1011, 'Realtime channel unavailable');
        });
      }
    });

    socket.on('message', async (raw) => {
      if (!subscribed) {
        send({ type: 'chat.error', error: 'Chat channel is not ready' });
        return;
      }

      let body: unknown;

      try {
        body = JSON.parse(raw.toString());
      } catch {
        send({ type: 'chat.error', error: 'Message must be valid JSON' });
        return;
      }

      const parsedMessage = chatMessageInputSchema.safeParse(body);

      if (!parsedMessage.success) {
        send({
          type: 'chat.error',
          error: 'Invalid chat message',
          issues: parsedMessage.error.issues
        });
        return;
      }

      if (
        parsedMessage.data.tenantId !== tenantId ||
        parsedMessage.data.conversationId !== conversationId
      ) {
        send({ type: 'chat.error', error: 'Message does not match this chat channel' });
        return;
      }

      const message = createChatMessage(parsedMessage.data);

      try {
        const result = await channel.send({
          type: 'broadcast',
          event: CHAT_EVENT,
          payload: message
        });

        if (result !== 'ok') {
          throw new Error(`Realtime broadcast failed: ${result}`);
        }

        send({ type: 'chat.ack', id: message.id });
      } catch (error) {
        send({
          type: 'chat.error',
          error: error instanceof Error ? error.message : 'Failed to broadcast message'
        });
      }
    });

    socket.on('close', () => {
      void cleanup();
    });

    socket.on('error', (error) => {
      console.error('Chat WebSocket error', error);
      void cleanup();
    });
  });

  wss.on('error', (error) => {
    console.error('Chat WebSocket server error', error);
  });

  return wss;
}

export async function closeChatRealtime(): Promise<void> {
  const wss = chatServer;
  chatServer = null;

  if (wss) {
    for (const client of wss.clients) {
      client.terminate();
    }

    await new Promise<void>((resolve) => {
      wss.close(() => resolve());
    });
  }

  await Promise.allSettled([...activeCleanups].map((cleanup) => cleanup()));
}
