import express from "express";
import { applySecurity } from "./middleware/security.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./middleware/errors.js";

export const app = express();

applySecurity(app);
app.use(express.json({ limit: "1mb" }));
app.use("/api", router);
app.use(errorHandler);
