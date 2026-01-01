/**
 * Monitoring and health check utilities for production
 * Integrates with Vercel Analytics and provides health endpoints
 */

import type { Request, Response } from "express";
import { logger } from "./logger";

/**
 * Health check endpoint
 * Returns 200 if service is healthy
 */
export async function healthCheck(_req: Request, res: Response) {
  try {
    // Could add database ping here if needed
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Performance monitoring middleware
 * Logs slow requests (>3s) for investigation
 */
export function performanceMonitoring(req: Request, res: Response, next: Function) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    // Log slow requests
    if (duration > 3000) {
      logger.warn('Slow request detected', {
        method: req.method,
        path: req.path,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }

    // Log errors
    if (res.statusCode >= 500) {
      logger.error('Server error response', undefined, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    }
  });

  next();
}

/**
 * Metrics tracking for important business events
 */
export const metrics = {
  /**
   * Track content generation
   */
  trackContentGeneration(userId: string, contentType: string, isPremium: boolean) {
    logger.info('Content generated', {
      event: 'content_generation',
      userId,
      contentType,
      isPremium,
    });
  },

  /**
   * Track subscription events
   */
  trackSubscription(userId: string, event: 'created' | 'updated' | 'cancelled') {
    logger.info('Subscription event', {
      event: 'subscription',
      userId,
      action: event,
    });
  },

  /**
   * Track rate limit hits
   */
  trackRateLimit(userId: string, endpoint: string) {
    logger.warn('Rate limit hit', {
      event: 'rate_limit',
      userId,
      endpoint,
    });
  },

  /**
   * Track authentication failures
   */
  trackAuthFailure(reason: string) {
    logger.warn('Authentication failed', {
      event: 'auth_failure',
      reason,
    });
  },
};
