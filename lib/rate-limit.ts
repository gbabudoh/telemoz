/**
 * A lightweight in-memory rate limiter.
 * In a production environment with multiple instances,
 * you should use Redis (e.g., Upstash) for shared state.
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  limit: number;     // Max requests
  windowMs: number;  // Time window in milliseconds
};

export async function rateLimit(identifier: string, config: RateLimitConfig) {
  const now = Date.now();
  const entry = store.get(identifier);

  // Clean up expired entry
  if (entry && now > entry.resetTime) {
    store.delete(identifier);
  }

  const currentEntry = store.get(identifier) || {
    count: 0,
    resetTime: now + config.windowMs,
  };

  if (currentEntry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: currentEntry.resetTime,
    };
  }

  currentEntry.count += 1;
  store.set(identifier, currentEntry);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - currentEntry.count,
    reset: currentEntry.resetTime,
  };
}
