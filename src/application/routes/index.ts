import { Router, Request, Response } from "express";
import { createWebhookRouter } from "../webhook/WebhookController";
import { FlowMenuController } from "../flows/FlowMenuController";

export function createRootRouter(): Router {
  const router = Router();
  const flowMenuController = new FlowMenuController();

  router.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  router.use("/webhook", createWebhookRouter());
  router.post(
  "/flows/menu",
  flowMenuController.getMenu.bind(flowMenuController)
);

  return router;
}
