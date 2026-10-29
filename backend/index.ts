import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from '../database/client';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { checkoutRouter } from './routes/checkout';
import { webhookRouter } from './routes/webhooks';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    credentials: true
  })
);

app.use('/api/webhooks', webhookRouter);
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/checkout', checkoutRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received, shutting down`);

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
