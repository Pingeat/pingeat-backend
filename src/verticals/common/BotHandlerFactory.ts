import { Tenant, TenantVertical } from "@prisma/client";
import { BotHandler } from "./BotHandler";
import {
  IWhatsAppClient,
  WhatsAppClient,
} from "../../infrastructure/whatsapp/WhatsAppClient";
import { RestaurantBotService } from "../restaurant/services/RestaurantBotService";
import { RestaurantMenuService } from "../restaurant/services/RestaurantMenuService";
import { RestaurantOrderService } from "../restaurant/services/RestaurantOrderService";
import { ChurchBotService } from "../church/services/ChurchBotService";
import { ChurchMemberService } from "../church/services/ChurchMemberService";

export class BotHandlerFactory {
  private readonly waClient: IWhatsAppClient;
  private readonly restaurantBot: RestaurantBotService;
  private readonly churchBot: ChurchBotService;

  constructor() {
    this.waClient = new WhatsAppClient();

    const menuService = new RestaurantMenuService();
    const orderService = new RestaurantOrderService();
    this.restaurantBot = new RestaurantBotService(
      this.waClient,
      menuService,
      orderService
    );

    const memberService = new ChurchMemberService();
    this.churchBot = new ChurchBotService(this.waClient, memberService);
  }

  getHandlerForTenant(tenant: Tenant): BotHandler {
    if (tenant.vertical === TenantVertical.RESTAURANT) {
      return this.restaurantBot;
    }
    if (tenant.vertical === TenantVertical.CHURCH) {
      return this.churchBot;
    }
    return this.restaurantBot;
  }
}
