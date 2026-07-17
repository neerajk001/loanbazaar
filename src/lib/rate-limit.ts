const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitOptions {
  interval?: number;
  maxRequests?: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const { interval = 60000, maxRequests = 10 } = options;
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + interval });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + interval };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
}

const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = 0;

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'anonymous';
}

export function applyRateLimit(
  request: Request,
  options?: RateLimitOptions
): { allowed: boolean; remaining: number; headers: Record<string, string> } {
  cleanupExpired();
  const identifier = getRateLimitIdentifier(request);
  const result = rateLimit(identifier, options);

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    headers: {
      'X-RateLimit-Limit': String(options?.maxRequests || 10),
      'X-RateLimit-Remaining': String(result.remaining),
      'X-RateLimit-Reset': String(result.resetTime),
    },
  };
}
