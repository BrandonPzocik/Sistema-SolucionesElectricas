import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-admin-token");
  if (!token || token !== env.ADMIN_PANEL_TOKEN) {
    return res.status(401).json({ message: "No autorizado" });
  }

  next();
};
