import express from "express";
import bodyParser from "body-parser";
import { createRootRouter } from "./application/routes/index";

export function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use("/", createRootRouter());
  return app;
}
