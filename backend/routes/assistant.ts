import { Router } from 'express';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type ModelMessage,
  type UIMessage
} from 'ai';
import { z } from 'zod';
import { env } from '../config/env';
import { prisma } from '../../database/client';
import { ApiError, asyncHandler } from '../utils/http';

const productSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .max(120)
    .optional()
    .describe('Free-text product search, such as linen shirt or wedding guest.'),
  category: z
    .string()
    .trim()
    .max(80)
    .optional()
    .describe('Category name or slug, such as dresses or outerwear.'),
  color: z.string().trim().max(64).optional().describe('Preferred color.'),
  size: z.string().trim().max(32).optional().describe('Requested size.'),
  maxPrice: z
    .number()
    .positive()
    .max(100_000)
    .optional()
    .describe('Maximum product price in the store currency.')
});

const orderLookupSchema = z.object({
  orderId: z.string().uuid().describe('The order identifier supplied by the customer.')
});

const sizeConsultationSchema = z.object({
  productId: z.string().uuid().describe('The product the customer is considering.'),
  requestedSize: z.string().trim().max(32).optional().describe('The size the customer is considering.'),
  requestedColor: z.string().trim().max(64).optional().describe('The color the customer is considering.'),
  usualSize: z.string().trim().max(32).optional().describe('The size the customer usually wears.'),
  fitPreference: z
    .enum(['slim', 'regular', 'relaxed'])
    .optional()
    .describe('How the customer prefers garments to fit.')
});

const messagePartSchema = z.looseObject({
  type: z.string().min(1),
  text: z.string().max(8_000).optional()
});

const requestSchema = z.object({
  tenantId: z.string().uuid(),
  messages: z
    .array(
      z.object({
        id: z.string().min(1).max(120),
        role: z.enum(['user', 'assistant']),
        parts: z.array(messagePartSchema).min(1).max(100)
      })
    )
    .min(1)
    .max(30),
  context: z
    .object({
      productId: z.string().uuid().optional(),
      orderId: z.string().uuid().optional()
    })
    .optional()
});

const openaiProvider = env.OPENAI_API_KEY
  ? createOpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

function truncate(value: string, maxLength = 600): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}...`;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function buildTools(tenantId: string) {
  return {
    recommend_products: tool({
      description:
        'Search this storefront for in-stock apparel and return product recommendations with prices, categories, colors, and sizes.',
      inputSchema: productSearchSchema,
      execute: async (input) => {
        const where = {
          tenantId,
          isArchived: false,
          ...(input.query
            ? {
                OR: [
                  { title: { contains: input.query, mode: 'insensitive' as const } },
                  { description: { contains: input.query, mode: 'insensitive' as const } }
                ]
              }
            : {}),
          ...(input.category
            ? {
                category: {
                  is: {
                    OR: [
                      { name: { equals: input.category, mode: 'insensitive' as const } },
                      { slug: { equals: input.category, mode: 'insensitive' as const } }
                    ]
                  }
                }
              }
            : {}),
          ...(input.maxPrice !== undefined ? { basePrice: { lte: input.maxPrice } } : {}),
          variants: {
            some: {
              ...(input.color
                ? { color: { equals: input.color, mode: 'insensitive' as const } }
                : {}),
              ...(input.size
                ? { size: { equals: input.size, mode: 'insensitive' as const } }
                : {}),
              inventoryCount: { gt: 0 }
            }
          }
        };

        const products = await prisma.product.findMany({
          where,
          take: 6,
          orderBy: [{ basePrice: 'asc' }, { title: 'asc' }],
          select: {
            id: true,
            title: true,
            description: true,
            basePrice: true,
            category: {
              select: {
                name: true,
                slug: true
              }
            },
            variants: {
              select: {
                sku: true,
                size: true,
                color: true,
                inventoryCount: true,
                variantPrice: true
              },
              orderBy: [{ inventoryCount: 'desc' }, { size: 'asc' }, { color: 'asc' }]
            }
          }
        });

        return {
          query: input,
          count: products.length,
          currency: env.STORE_CURRENCY,
          products: products.map((product) => ({
            id: product.id,
            title: product.title,
            description: truncate(product.description),
            price: product.basePrice.toFixed(2),
            category: product.category,
            variants: product.variants.map((variant) => ({
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              inStock: variant.inventoryCount > 0,
              inventoryCount: variant.inventoryCount,
              price: variant.variantPrice.toFixed(2)
            }))
          }))
        };
      }
    }),

    lookup_order: tool({
      description:
        'Look up an order for this storefront and return its current status and total. Only returns orders belonging to the current tenant.',
      inputSchema: orderLookupSchema,
      execute: async (input) => {
        const order = await prisma.order.findFirst({
          where: {
            id: input.orderId,
            tenantId
          },
          select: {
            id: true,
            status: true,
            aggregateTotal: true,
            tenant: {
              select: {
                businessName: true
              }
            }
          }
        });

        const lookupAt = new Date().toISOString();

        console.info(
          JSON.stringify({
            event: 'assistant.order_lookup',
            tenantId,
            found: Boolean(order),
            lookupAt
          })
        );

        if (!order) {
          return {
            found: false,
            lookupAt,
            message:
              'No matching order was found for this storefront. Ask the customer to verify the order identifier.'
          };
        }

        return {
          found: true,
          lookupAt,
          order: {
            id: order.id,
            status: order.status,
            total: order.aggregateTotal.toFixed(2),
            currency: env.STORE_CURRENCY,
            store: order.tenant.businessName
          }
        };
      }
    }),

    size_consultation: tool({
      description:
        'Check size and color availability for a product and provide sizing guidance based on the product description and in-stock variants.',
      inputSchema: sizeConsultationSchema,
      execute: async (input) => {
        const product = await prisma.product.findFirst({
          where: {
            id: input.productId,
            tenantId,
            isArchived: false
          },
          select: {
            id: true,
            title: true,
            description: true,
            basePrice: true,
            category: {
              select: {
                name: true
              }
            },
            variants: {
              select: {
                size: true,
                color: true,
                inventoryCount: true,
                variantPrice: true
              },
              orderBy: [{ inventoryCount: 'desc' }, { size: 'asc' }, { color: 'asc' }]
            }
          }
        });

        if (!product) {
          return {
            found: false,
            message: 'That product is not available in this storefront.'
          };
        }

        const requestedSize = input.requestedSize ? normalize(input.requestedSize) : null;
        const requestedColor = input.requestedColor ? normalize(input.requestedColor) : null;

        const requestedMatches = product.variants.filter(
          (variant) =>
            (!requestedSize || normalize(variant.size) === requestedSize) &&
            (!requestedColor || normalize(variant.color) === requestedColor)
        );

        const availableVariants = product.variants.filter(
          (variant) => variant.inventoryCount > 0
        );

        return {
          found: true,
          product: {
            id: product.id,
            title: product.title,
            description: truncate(product.description),
            price: product.basePrice.toFixed(2),
            category: product.category,
            variants: product.variants.map((variant) => ({
              size: variant.size,
              color: variant.color,
              inStock: variant.inventoryCount > 0,
              inventoryCount: variant.inventoryCount,
              price: variant.variantPrice.toFixed(2)
            }))
          },
          consultation: {
            requestedSize: input.requestedSize ?? null,
            requestedColor: input.requestedColor ?? null,
            usualSize: input.usualSize ?? null,
            fitPreference: input.fitPreference ?? null,
            requestedCombinationInStock:
              requestedSize || requestedColor
                ? requestedMatches.some((variant) => variant.inventoryCount > 0)
                : null,
            availableSizes: [...new Set(availableVariants.map((variant) => variant.size))],
            availableColors: [...new Set(availableVariants.map((variant) => variant.color))],
            guidance:
              'Use the product description and the available variants to advise on fit. Do not guarantee fit. If the requested combination is unavailable, suggest in-stock sizes or colors and ask about fit preference.'
          }
        };
      }
    })
  };
}

function buildInstructions(
  businessName: string,
  context: z.infer<typeof requestSchema>['context']
): string {
  const contextLines = [
    context?.productId
      ? `The customer is currently viewing product ${context.productId}.`
      : null,
    context?.orderId ? `The customer supplied order ${context.orderId}.` : null
  ].filter((line): line is string => Boolean(line));

  return [
    `You are the AI shopping assistant for ${businessName}, an apparel storefront.`,
    'Help customers discover products, understand fit and availability, and check the status of their order.',
    'Use recommend_products for product suggestions, size_consultation for fit and stock questions, and lookup_order for order status.',
    'Only discuss products and orders belonging to this storefront.',
    'Never invent product details, inventory, prices, order statuses, or delivery dates. If a tool does not return the answer, say so and ask a clarifying question.',
    'Never claim an order is shipped or delivered unless lookup_order returns that status.',
    'For sizing, consider the product description, requested size and color, available variants, and the customer fit preference. Do not guarantee fit.',
    `Prices are in ${env.STORE_CURRENCY}.`,
    'Reply in the customer language unless they ask for another language. Be concise, warm, and practical.',
    ...contextLines
  ].join('\n');
}

export const assistantRouter = Router();

assistantRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    if (!openaiProvider) {
      throw new ApiError(503, 'AI assistant is not configured');
    }

    const input = requestSchema.parse(req.body);

    const tenant = await prisma.tenant.findUnique({
      where: { id: input.tenantId },
      select: { businessName: true }
    });

    if (!tenant) {
      throw new ApiError(404, 'Store not found');
    }

    const tools = buildTools(input.tenantId);
    const messages: ModelMessage[] = await convertToModelMessages(
      input.messages as UIMessage[],
      { tools }
    );

    const result = streamText({
      model: openaiProvider(env.OPENAI_MODEL),
      instructions: buildInstructions(tenant.businessName, input.context),
      messages,
      tools,
      stopWhen: stepCountIs(4),
      onError: ({ error }) => {
        console.error('Assistant stream error', error);
      }
    });

    await result.pipeUIMessageStreamToResponse(res);
  })
);
