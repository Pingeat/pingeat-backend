import { Tenant } from "@prisma/client";

export type WhatsAppMessage = {
  id: string;
  from: string;
  type: string;
  text?: {
    body: string;
  };
};

export interface BotHandler {
  handleIncomingMessage(
    tenant: Tenant,
    msg: WhatsAppMessage,
    raw: any
  ): Promise<void>;
  handleStatus(tenant: Tenant, status: any, raw: any): Promise<void>;
}
