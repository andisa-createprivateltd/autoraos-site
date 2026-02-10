type RateEntry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const store = new Map<string, RateEntry>();

function cleanupExpired(now: number) {
  for (const [entryKey, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(entryKey);
    }
  }
}

export function checkRateLimit(
  key: string,
  options?: {
    windowMs?: number;
    maxRequests?: number;
  }
) {
  const now = Date.now();
  cleanupExpired(now);

  const windowMs = options?.windowMs ?? WINDOW_MS;
  const maxRequests = options?.maxRequests ?? MAX_REQUESTS;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: maxRequests - entry.count };
}
