import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ORIGIN: z.string().url(),
  DB_HOST: z.string().min(1).default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().min(1),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().default(""),
  MERCADO_PAGO_WEBHOOK_SECRET: z.string().default(""),
  WHATSAPP_PHONE: z.string().min(8),
  ADMIN_JWT_SECRET: z.string().min(10),
  ADMIN_PASSWORD_HASH: z.string().min(1).default("admin123"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(120)
});

export const env = EnvSchema.parse(process.env);
