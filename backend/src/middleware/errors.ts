import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Validation error", detail: err.flatten() });
  }

  return res.status(500).json({ error: "Internal server error", detail: err.message });
};
