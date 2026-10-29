import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '.env') });
config({ path: path.resolve(__dirname, '../.env') });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
