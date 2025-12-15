import { createApp } from "./app";
import { env } from "./config/env";
import { connectPrisma } from "./infrastructure/db/prismaClient";
import { logger } from "./infrastructure/logging/logger";

async function main(): Promise<void> {
  await connectPrisma();

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(
      "PINGEAT multi-tenant backend listening on port " + env.port,
      {
        env: env.nodeEnv,
      }
    );
  });
}

main().catch((err) => {
  logger.error("Fatal startup error", err);
  process.exit(1);
});
