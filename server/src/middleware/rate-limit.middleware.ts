import { NextFunction, Request, Response } from "express";

/**
 * Minimal fixed-window rate limiter keyed by client IP.
 * Protects paid upstream APIs (OpenRouter, Alchemy) on public endpoints.
 * In-memory, so limits are per instance; a Redis store would share them.
 */
export const rateLimit = ({
  windowMs,
  max,
  message,
}: {
  windowMs: number;
  max: number;
  message: string;
}) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      res.setHeader(
        "Retry-After",
        Math.ceil((entry.resetAt - now) / 1000)
      );
      return res.status(429).json({ success: false, message });
    }

    return next();
  };
};
