import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorWithStatus = Error & { statusCode?: number };

const hasStatusCode = (err: Error): err is ErrorWithStatus => {
  return typeof (err as ErrorWithStatus).statusCode === "number";
};

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (hasStatusCode(err)) {
    return res.status(err.statusCode as number).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation error",
      detail: err.issues.map((issue) => issue.message).join(", ")
    });
  }

  return res.status(500).json({ error: "Internal server error", detail: err.message });
};
