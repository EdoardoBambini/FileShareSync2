import { RequestHandler } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client for Upstash (serverless-compatible)
let redis: Redis | null = null;
let aiRateLimiter: Ratelimit | null = null;

// Only initialize if Upstash credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // AI endpoints: 10 requests per minute per user
  aiRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:ai",
  });
}

/**
 * Rate limiting middleware for AI content generation endpoints
 * Limits requests per user to prevent API abuse and cost overruns
 */
export const rateLimitAI: RequestHandler = async (req: any, res, next) => {
  // Skip rate limiting if Upstash is not configured (dev mode)
  if (!aiRateLimiter) {
    console.warn("Rate limiting disabled - Upstash not configured");
    return next();
  }

  try {
    const userId = req.user?.id || req.ip || 'anonymous';
    const identifier = `user:${userId}`;

    const { success, limit, remaining, reset } = await aiRateLimiter.limit(identifier);

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    // On error, allow the request to proceed (fail open)
    next();
  }
};
