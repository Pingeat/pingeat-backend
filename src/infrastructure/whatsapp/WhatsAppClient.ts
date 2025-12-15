// import axios, { AxiosInstance } from "axios";
// import { env } from "../../config/env";
// import { logger } from "../logging/logger";

// export interface TemplateFlowConfig {
//   enabled: boolean;
//   buttonIndex?: number;
//   flowToken?: string;
//   flowActionData?: Record<string, unknown>;
// }

// export interface IWhatsAppClient {
//   sendTextMessage(to: string, text: string): Promise<void>;
//   sendTemplate(
//     to: string,
//     templateName: string,
//     languageCode: string,
//     bodyParams?: string[],
//     flowConfig?: TemplateFlowConfig
//   ): Promise<void>;
// }

// export class WhatsAppClient implements IWhatsAppClient {
//   private readonly http: AxiosInstance;
//   private readonly phoneNumberId: string;

//   constructor() {
//     this.phoneNumberId = env.whatsapp.phoneNumberId;
//     this.http = axios.create({
//       baseURL: env.whatsapp.apiBaseUrl,
//       headers: {
//         Authorization: `Bearer ${env.whatsapp.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       timeout: 8000,
//     });
//   }

//   async sendTextMessage(to: string, text: string): Promise<void> {
//     try {
//       await this.http.post(`/${this.phoneNumberId}/messages`, {
//         messaging_product: "whatsapp",
//         to,
//         type: "text",
//         text: { body: text },
//       });
//     } catch (err: any) {
//       logger.error(
//         "Error sending WhatsApp text",
//         err?.response?.data || err?.message
//       );
//       throw err;
//     }
//   }

//   async sendTemplate(
//     to: string,
//     templateName: string,
//     languageCode: string,
//     bodyParams: string[] = [],
//     flowConfig?: TemplateFlowConfig
//   ): Promise<void> {
//     const components: any[] = [];

//     if (bodyParams.length > 0) {
//       components.push({
//         type: "body",
//         parameters: bodyParams.map((value) => ({
//           type: "text" as const,
//           text: value,
//         })),
//       });
//     }

//     if (flowConfig?.enabled) {
//       components.push({
//         type: "button",
//         sub_type: "flow",
//         index: String(flowConfig.buttonIndex ?? 0),
//         parameters: [
//           {
//             type: "action",
//             action: {
//               flow_token: flowConfig.flowToken ?? "unused",
//               flow_action_data: flowConfig.flowActionData ?? {},
//             },
//           },
//         ],
//       });
//     }

//     try {
//       await this.http.post(`/${this.phoneNumberId}/messages`, {
//         messaging_product: "whatsapp",
//         to,
//         type: "template",
//         template: {
//           name: templateName,
//           language: { code: languageCode },
//           components,
//         },
//       });
//     } catch (err: any) {
//       logger.error(
//         "Error sending WhatsApp template",
//         err?.response?.data || err?.message
//       );
//       throw err;
//     }
//   }
// }


// import axios, { AxiosInstance } from "axios";
// import { env } from "../../config/env";
// import { logger } from "../logging/logger";

// export interface IWhatsAppClient {
//   sendTextMessage(to: string, text: string): Promise<void>;
//   sendTemplate(
//     to: string,
//     templateName: string,
//     languageCode: string,
//     bodyParams?: string[]
//   ): Promise<void>;
// }

// export class WhatsAppClient implements IWhatsAppClient {
//   private readonly http: AxiosInstance;
//   private readonly phoneNumberId: string;

//   constructor() {
//     this.phoneNumberId = env.whatsapp.phoneNumberId;
//     this.http = axios.create({
//       baseURL: env.whatsapp.apiBaseUrl,
//       headers: {
//         Authorization: `Bearer ${env.whatsapp.accessToken}`,
//         "Content-Type": "application/json",
//       },
//       timeout: 8000,
//     });
//   }

//   async sendTextMessage(to: string, text: string): Promise<void> {
//     try {
//       await this.http.post(`/${this.phoneNumberId}/messages`, {
//         messaging_product: "whatsapp",
//         to,
//         type: "text",
//         text: { body: text },
//       });
//     } catch (err: any) {
//       logger.error(
//         "Error sending WhatsApp text",
//         err?.response?.data || err?.message
//       );
//       throw err;
//     }
//   }

//   async sendTemplate(
//     to: string,
//     templateName: string,
//     languageCode: string,
//     bodyParams: string[] = []
//   ): Promise<void> {
//     const components =
//       bodyParams.length > 0
//         ? [
//             {
//               type: "body",
//               parameters: bodyParams.map((value) => ({
//                 type: "text" as const,
//                 text: value,
//               })),
//             },
//           ]
//         : [];

//     try {
//       await this.http.post(`/${this.phoneNumberId}/messages`, {
//         messaging_product: "whatsapp",
//         to,
//         type: "template",
//         template: {
//           name: templateName,
//           language: { code: languageCode },
//           components,
//         },
//       });
//     } catch (err: any) {
//       logger.error(
//         "Error sending WhatsApp template",
//         err?.response?.data || err?.message
//       );
//       throw err;
//     }
//   }
// }



import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { logger } from "../logging/logger";

/**
 * Optional configuration for attaching a Flow button
 * to a WhatsApp message template.
 */
export interface TemplateFlowConfig {
  /** Whether to attach a Flow button component */
  enabled: boolean;

  /** Index of the button in the template (usually 0) */
  buttonIndex?: number;

  /**
   * Optional flow token – can be any string if you don't use it
   * for session tracking. "unused" is fine.
   */
  flowToken?: string;

  /**
   * Initial payload for the Flow.
   * Shape must match the Flow JSON schema you defined in Business Manager.
   */
  flowActionData?: Record<string, unknown>;
}

export interface IWhatsAppClient {
  sendTextMessage(to: string, text: string): Promise<void>;

  /**
   * Send a template message.
   * - `bodyParams` is used for {{1}}, {{2}}, etc. in the BODY of the template.
   * - `flowConfig` is used only when the template has a Flow button.
   */
  sendTemplate(
    to: string,
    templateName: string,
    languageCode: string,
    bodyParams?: string[],
    flowConfig?: TemplateFlowConfig
  ): Promise<void>;
}

export class WhatsAppClient implements IWhatsAppClient {
  private readonly http: AxiosInstance;
  private readonly phoneNumberId: string;

  constructor() {
    this.phoneNumberId = env.whatsapp.phoneNumberId;

    this.http = axios.create({
      baseURL: env.whatsapp.apiBaseUrl, // e.g. https://graph.facebook.com/v23.0
      headers: {
        Authorization: `Bearer ${env.whatsapp.accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 8000,
    });
  }

  async sendTextMessage(to: string, text: string): Promise<void> {
    try {
      await this.http.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      });
    } catch (err: any) {
      logger.error(
        "Error sending WhatsApp text",
        err?.response?.data || err?.message
      );
      throw err;
    }
  }

  async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string,
    bodyParams: string[] = [],
    flowConfig?: TemplateFlowConfig
  ): Promise<void> {
    const components: any[] = [];

    // 1) BODY component (for {{1}}, {{2}}, etc.)
    if (bodyParams.length > 0) {
      components.push({
        type: "body",
        parameters: bodyParams.map((value) => ({
          type: "text" as const,
          text: value,
        })),
      });
    }

    // 2) Optional Flow button component
    //
    // This is required when your template has a Flow button attached.
    // It must match Meta docs and your template configuration:
    // - type: "button"
    // - sub_type: "flow"
    // - index: "0" (string)
    // - parameters[0].type = "action"
    // - parameters[0].action.flow_token + flow_action_data
    if (flowConfig?.enabled) {
      components.push({
        type: "button",
        sub_type: "flow",
        index: String(flowConfig.buttonIndex ?? 0),
        parameters: [
          {
            type: "action",
            action: {
              flow_token: flowConfig.flowToken ?? "unused",
              flow_action_data: flowConfig.flowActionData ?? {},
            },
          },
        ],
      });
    }

    try {
      await this.http.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      });
    } catch (err: any) {
      logger.error(
        "Error sending WhatsApp template",
        err?.response?.data || err?.message
      );
      throw err;
    }
  }
}
