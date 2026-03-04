import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ORIGIN: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().min(1),
  WHATSAPP_PHONE: z.string().min(8),
  ADMIN_JWT_SECRET: z.string().min(10),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(120)
});

export const env = EnvSchema.parse(process.env);
