import express from "express";
import { applySecurity } from "./middleware/security.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errors.js";

export const app = express();

applySecurity(app);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ ok: true, name: "soluciones-electricas-api" });
});

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/api", router);
app.use(errorHandler);
