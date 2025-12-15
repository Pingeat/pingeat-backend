import { PrismaClient } from "@prisma/client";
import { logger } from "../logging/logger";

export const prisma = new PrismaClient();

export async function connectPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (err) {
    logger.error("Error connecting to database", err);
    throw err;
  }
}
