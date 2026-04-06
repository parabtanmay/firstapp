import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Invalid request", issues: err.issues });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ message });
};
