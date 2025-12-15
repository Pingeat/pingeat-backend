import { Request, Response, Router } from "express";
import { env } from "../../config/env";
import { WebhookService } from "./WebhookService";
import { logger } from "../../infrastructure/logging/logger";

export function createWebhookRouter(): Router {
  const router = Router();
  const service = new WebhookService();

  // GET for verification
  router.get("/", (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === env.whatsapp.verifyToken) {
      logger.info("Webhook Token validated",  challenge);
      return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
  });

  // POST for events
  router.post("/", async (req: Request, res: Response) => {
    try {
      await service.handleWebhook(req.body);
      res.sendStatus(200);
    } catch (err) {
      logger.error("Error in WebhookController.handle", err);
      res.sendStatus(500);
    }
  });

  return router;
}
