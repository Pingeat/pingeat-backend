import "dotenv/config";

type EnvWhatsApp = {
  apiBaseUrl: string;
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
};

type EnvConfig = {
  port: number;
  nodeEnv: string;
  whatsapp: EnvWhatsApp;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  whatsapp: {
    apiBaseUrl:
      process.env.WHATSAPP_API_BASE_URL || "https://graph.facebook.com/v21.0",
    phoneNumberId: requireEnv("WHATSAPP_PHONE_NUMBER_ID"),
    accessToken: requireEnv("WHATSAPP_ACCESS_TOKEN"),
    verifyToken: requireEnv("WHATSAPP_VERIFY_TOKEN"),
  },
};
