/**
 * Process-Local Sliding Window Rate Limiter
 * 
 * ARCHITECTURAL SPECIFICATIONS & CONSTRAINTS:
 * 1. Storage Scope:
 *    - In-Memory only (process-local `Map`).
 *    - Does NOT persist across server restarts, container deployments, or scale horizontally
 *      across multiple isolated serverless worker processes (e.g. multi-region AWS Lambda / Vercel functions).
 *    - Serves as a fast, zero-dependency barrier against rapid client burst spam within a single instance.
 * 2. Proxy Header Trust Model:
 *    - Uses `x-forwarded-for` (first IP) and `x-real-ip` to determine the caller identity.
 *    - Assumes the application runs behind a trusted reverse proxy / edge network (e.g. Cloudflare,
 *      Nginx, Vercel) that strips or replaces client-forged headers.
 *    - If directly exposed without an edge proxy, header spoofing is theoretically possible.
 * 3. Scalability Roadmap (Phase 2):
 *    - For distributed multi-instance horizontal scaling, replace with a distributed key-value store
 *      such as Redis (Upstash) or a dedicated PostgreSQL sliding-window table.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired records every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      store.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * Checks and increments the rate limit for a specific identifier.
 * 
 * @param identifier Client IP address or unique token
 * @param maxRequests Maximum allowed requests in the time window (default: 5)
 * @param windowMs Time window in milliseconds (default: 15 minutes = 900,000 ms)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(windowMs);

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter timestamps within the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
  };
}

/**
 * Resets rate limit for a given identifier (primarily used in testing).
 */
export function resetRateLimit(identifier?: string) {
  if (identifier) {
    store.delete(identifier);
  } else {
    store.clear();
  }
}
