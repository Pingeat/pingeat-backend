import { TenantService } from "../../domain/tenants/TenantService";
import { BotHandlerFactory } from "../../verticals/common/BotHandlerFactory";
import { WhatsAppMessage } from "../../verticals/common/BotHandler";
import { logger } from "../../infrastructure/logging/logger";

export class WebhookService {
  private readonly tenantService: TenantService;
  private readonly botFactory: BotHandlerFactory;

  constructor() {
    this.tenantService = new TenantService();
    this.botFactory = new BotHandlerFactory();
  }

  async handleWebhook(body: any): Promise<void> {
    if (!body?.entry || !Array.isArray(body.entry)) return;

    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        const phoneNumberId: string | undefined =
          value.metadata?.phone_number_id;
        if (!phoneNumberId) {
          logger.warn("No phone_number_id on webhook payload", { value });
          continue;
        }

        const tenant = await this.tenantService.findActiveByPhoneNumberId(
          phoneNumberId
        );
        if (!tenant) continue;

        const bot = this.botFactory.getHandlerForTenant(tenant);

        const messages = value.messages;
        if (Array.isArray(messages)) {
          for (const msg of messages) {
            const mapped: WhatsAppMessage = {
              id: msg.id,
              from: msg.from,
              type: msg.type,
              text: msg.text,
            };
            await bot.handleIncomingMessage(tenant, mapped, msg);
          }
        }

        const statuses = value.statuses;
        if (Array.isArray(statuses)) {
          for (const st of statuses) {
            await bot.handleStatus(tenant, st, st);
          }
        }
      }
    }
  }
}
