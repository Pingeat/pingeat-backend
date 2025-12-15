// import { Tenant } from "@prisma/client";
// import { BotHandler, WhatsAppMessage } from "../../common/BotHandler";
// import { IWhatsAppClient } from "../../../infrastructure/whatsapp/WhatsAppClient";
// import { RestaurantMenuService } from "./RestaurantMenuService";
// import { RestaurantOrderService } from "./RestaurantOrderService";
// import { ItemCodeQuantity } from "../domain/RestaurantTypes";

// export class RestaurantBotService implements BotHandler {
//   constructor(
//     private readonly waClient: IWhatsAppClient,
//     private readonly menuService: RestaurantMenuService,
//     private readonly orderService: RestaurantOrderService
//   ) {}

//   async handleIncomingMessage(
//     tenant: Tenant,
//     msg: WhatsAppMessage,
//     _raw: any
//   ): Promise<void> {
//     const from = msg.from;
//     const type = msg.type;

//     if (type !== "text") return;

//     const rawText = msg.text?.body ?? "";
//     const text = rawText.trim();
//     const lower = text.toLowerCase();

//     // Entry -> send menu template + Flow
//     if (["hi", "menu", "order", "start"].includes(lower)) {
//       const config = (tenant.configJson || {}) as any;
//       const templateName: string = config.menuTemplateName || "pingeat_menu_v1";
//       const languageCode: string =
//         config.templateLanguageCode || "en_US";
//       const nameFallback = "Friend"; // you can later pull from DB if needed

//       await this.waClient.sendTemplate(from, templateName, languageCode, [nameFallback], {
//         enabled: true,
//         buttonIndex: 0,
//         flowToken: "unused",
//         flowActionData: {
//           order_type_options: [
//             { id: "pickup", title: "Pickup at store" },
//             { id: "delivery", title: "Home delivery" },
//           ],
//         },
//       });

//       return;
//     }

//     // Fallback: manual "order CODE1x2,CODE2x1"
//     if (lower.startsWith("order ")) {
//       const codesPart = text.substring("order ".length).trim();
//       const parts = codesPart.split(",");
//       const items: ItemCodeQuantity[] = parts
//         .map((p) => p.trim())
//         .filter((p) => p.length > 0)
//         .map((p) => {
//           const [codeRaw, qtyRaw] = p.split("x");
//           const code = codeRaw.trim().toUpperCase();
//           const qty = qtyRaw ? Number(qtyRaw) : 1;
//           return { code, qty: Number.isFinite(qty) && qty > 0 ? qty : 1 };
//         });

//       const codes = items.map((i) => i.code);
//       try {
//         const menuItems = await this.menuService.getAvailableItemsByCodes(
//           tenant.id,
//           codes
//         );
//         const order = await this.orderService.createOrderFromMenuItems(
//           tenant.id,
//           from,
//           items,
//           menuItems
//         );
//         await this.waClient.sendTextMessage(
//           from,
//           `✅ Order received! Your order ID is ${order.id}.`
//         );
//       } catch (_err: any) {
//         await this.waClient.sendTextMessage(
//           from,
//           "Sorry, we could not create your order. Some items may be unavailable."
//         );
//       }

//       return;
//     }

//     await this.waClient.sendTextMessage(
//       from,
//       "Welcome to PINGEAT! Reply with *hi* or *menu* to view options, or *order CODE1x2,CODE2x1* to place an order."
//     );
//   }

//   async handleStatus(
//     _tenant: Tenant,
//     _status: any,
//     _raw: any
//   ): Promise<void> {
//     return;
//   }
// }





// import { Tenant } from "@prisma/client";
// import { BotHandler, WhatsAppMessage } from "../../common/BotHandler";
// import { IWhatsAppClient } from "../../../infrastructure/whatsapp/WhatsAppClient";
// import { RestaurantMenuService } from "./RestaurantMenuService";
// import { RestaurantOrderService } from "./RestaurantOrderService";
// import { ItemCodeQuantity } from "../domain/RestaurantTypes";

// export class RestaurantBotService implements BotHandler {
//   constructor(
//     private readonly waClient: IWhatsAppClient,
//     private readonly menuService: RestaurantMenuService,
//     private readonly orderService: RestaurantOrderService
//   ) {}

//   async handleIncomingMessage(
//     tenant: Tenant,
//     msg: WhatsAppMessage,
//     _raw: any
//   ): Promise<void> {
//     const from = msg.from;
//     const type = msg.type;

//     if (type !== "text") return;

//     const rawText = msg.text?.body ?? "";
//     const text = rawText.trim();
//     const lower = text.toLowerCase();

//     // Entry → send menu template (Flow button is already configured in template)
//     if (["hi", "menu", "order", "start"].includes(lower)) {
//       const config = (tenant.configJson || {}) as any;
//       const templateName: string =
//         config.menuTemplateName || "pingeat_menu_v1";
//       const languageCode: string =
//         config.templateLanguageCode || "en_US";
//       const nameFallback = "Friend"; // can be replaced with real name later

//       await this.waClient.sendTemplate(
//         from,
//         templateName,
//         languageCode,
//         [nameFallback]
//       );

//       return;
//     }

//     // Manual fallback: "order CODE1x2,CODE2x1"
//     if (lower.startsWith("order ")) {
//       const codesPart = text.substring("order ".length).trim();
//       const parts = codesPart.split(",");
//       const items: ItemCodeQuantity[] = parts
//         .map((p) => p.trim())
//         .filter((p) => p.length > 0)
//         .map((p) => {
//           const [codeRaw, qtyRaw] = p.split("x");
//           const code = codeRaw.trim().toUpperCase();
//           const qtyParsed = qtyRaw ? Number(qtyRaw) : 1;
//           const qty =
//             Number.isFinite(qtyParsed) && qtyParsed > 0 ? qtyParsed : 1;
//           return { code, qty };
//         });

//       const codes = items.map((i) => i.code);

//       try {
//         const menuItems = await this.menuService.getAvailableItemsByCodes(
//           tenant.id,
//           codes
//         );
//         const order = await this.orderService.createOrderFromMenuItems(
//           tenant.id,
//           from,
//           items,
//           menuItems
//         );
//         await this.waClient.sendTextMessage(
//           from,
//           `✅ Order received! Your order ID is ${order.id}.`
//         );
//       } catch (_err: any) {
//         await this.waClient.sendTextMessage(
//           from,
//           "Sorry, we could not create your order. Some items may be unavailable."
//         );
//       }

//       return;
//     }

//     await this.waClient.sendTextMessage(
//       from,
//       "Welcome to PINGEAT! Reply with *hi* or *menu* to view options, or *order CODE1x2,CODE2x1* to place an order."
//     );
//   }

//   async handleStatus(
//     _tenant: Tenant,
//     _status: any,
//     _raw: any
//   ): Promise<void> {
//     // We'll use this later for Flow completion + categories
//     return;
//   }
// }


import { Tenant } from "@prisma/client";
import { BotHandler, WhatsAppMessage } from "../../common/BotHandler";
import {
  IWhatsAppClient,
  TemplateFlowConfig,
} from "../../../infrastructure/whatsapp/WhatsAppClient";
import { RestaurantMenuService } from "./RestaurantMenuService";
import { RestaurantOrderService } from "./RestaurantOrderService";
import { ItemCodeQuantity } from "../domain/RestaurantTypes";

export class RestaurantBotService implements BotHandler {
  constructor(
    private readonly waClient: IWhatsAppClient,
    private readonly menuService: RestaurantMenuService,
    private readonly orderService: RestaurantOrderService
  ) {}

  async handleIncomingMessage(
    tenant: Tenant,
    msg: WhatsAppMessage,
    _raw: any
  ): Promise<void> {
    const from = msg.from;
    const type = msg.type;

    if (type !== "text") {
      // Later: handle interactive / flow-completed callbacks
      return;
    }

    const rawText = msg.text?.body ?? "";
    const text = rawText.trim();
    const lower = text.toLowerCase();

    // ==========
    // ENTRY FLOW
    // ==========
    if (["hi", "menu", "order", "start"].includes(lower)) {
      const config = (tenant.configJson || {}) as any;

      // Template + language from config, with safe fallbacks
      const templateName: string =
        config.menuTemplateName || "pingeat_menu_v"; // 👈 match your template name
      const languageCode: string =
        config.templateLanguageCode || "en_US";

      // In future you can load the name from DB; for now use a generic friendly name
      const displayName = "Friend";

      // Flow button config: this MUST match your Flow template setup
      const flowConfig: TemplateFlowConfig = {
        enabled: true,
        buttonIndex: 0, // first button
        flowToken: "unused",
        flowActionData: {
          // This shape is up to you & your Flow JSON
          // Example for your "delivery / pickup" choice:
          order_type_options: [
            { id: "pickup", title: "Pickup at store" },
            { id: "delivery", title: "Home delivery" },
          ],
        },
      };

      await this.waClient.sendTemplate(
        from,
        templateName,
        languageCode,
        [displayName], // {{1}} in template body
        flowConfig
      );

      return;
    }

    // ===========================================
    // MANUAL FALLBACK: "order CODE1x2,CODE2x1"
    // ===========================================
    if (lower.startsWith("order ")) {
      const codesPart = text.substring("order ".length).trim();

      const items: ItemCodeQuantity[] = codesPart
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map((p) => {
          const [codeRaw, qtyRaw] = p.split("x");
          const code = codeRaw.trim().toUpperCase();
          const qtyNum = qtyRaw ? Number(qtyRaw) : 1;
          const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;
          return { code, qty };
        });

      const codes = items.map((i) => i.code);

      try {
        const menuItems = await this.menuService.getAvailableItemsByCodes(
          tenant.id,
          codes
        );

        const order = await this.orderService.createOrderFromMenuItems(
          tenant.id,
          from,
          items,
          menuItems
        );

        await this.waClient.sendTextMessage(
          from,
          `✅ Order received! Your order ID is ${order.id}.`
        );
      } catch (_err: any) {
        await this.waClient.sendTextMessage(
          from,
          "Sorry, we could not create your order. Some items may be unavailable."
        );
      }

      return;
    }

    // ===========
    // FALLBACK
    // ===========
    await this.waClient.sendTextMessage(
      from,
      "Welcome to PINGEAT! Reply with *hi* or *menu* to view options, or *order CODE1x2,CODE2x1* to place an order."
    );
  }

  async handleStatus(_tenant: Tenant, _status: any, _raw: any): Promise<void> {
    // Later: track deliveries, flows, failures, etc.
    return;
  }
}
