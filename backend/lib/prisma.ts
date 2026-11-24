import { resolve } from "node:path";
import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma";

const backendDir = resolve(__dirname, "..");

config({ path: resolve(backendDir, ".env") });
config({ path: resolve(backendDir, "../.env") });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
