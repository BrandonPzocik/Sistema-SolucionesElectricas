import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Express } from "express";
import { env } from "../config/env.js";

export const applySecurity = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === "production"
    })
  );
  app.use(cors({ origin: env.APP_ORIGIN }));
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
};
