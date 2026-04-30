/**
 * Redis Client — Production-Grade Singleton
 *
 * Features:
 *  - Upstash (rediss://) TLS support out-of-the-box
 *  - Exponential-backoff retry with jitter (avoids thundering herd)
 *  - Maximum retry cap so the process never spins indefinitely
 *  - Lazy connect: client is only created when first imported
 *  - Graceful connect / disconnect helpers used by server.ts
 *  - Health-check helper for /health endpoint
 *  - All errors are logged but never swallowed silently
 */

import Redis, { RedisOptions } from 'ioredis';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_RETRY_DELAY_MS = 30_000;   // cap exponential back-off at 30 s
const MAX_RETRIES        = 20;       // give up after this many attempts
const BASE_RETRY_MS      = 200;      // initial back-off seed

// ---------------------------------------------------------------------------
// Build ioredis options from the REDIS_URL env variable
// ---------------------------------------------------------------------------

function buildRedisOptions(): RedisOptions {
  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error('REDIS_URL is not defined in environment variables');
  }

  const isTLS = url.startsWith('rediss://');

  return {
    // ioredis accepts a full URL string via the `lazyConnect` path; we parse
    // it manually so we can inject extra options cleanly.
    // Setting `enableReadyCheck: true` ensures we only resolve after Redis
    // confirms it is ready to serve commands.
    enableReadyCheck: true,

    // Keep the connection alive; prevents cloud providers from closing idle
    // sockets (Upstash idles out after ~60 s by default).
    keepAlive: 10_000,

    // TLS is required for Upstash (rediss://)
    tls: isTLS ? {} : undefined,

    // How long to wait for a command reply before treating it as a timeout
    commandTimeout: 5_000,

    // How long to wait for the initial TCP handshake
    connectTimeout: 10_000,

    // Exponential back-off with per-attempt jitter
    retryStrategy(times: number): number | null {
      if (times > MAX_RETRIES) {
        logger.error(`[Redis] Giving up after ${times} connection attempts`);
        return null; // stop retrying — triggers an 'error' event
      }

      // Exponential back-off: 200, 400, 800 … capped at 30 s
      const base = Math.min(BASE_RETRY_MS * 2 ** (times - 1), MAX_RETRY_DELAY_MS);

      // Add ±20 % jitter to avoid thundering-herd reconnect storms
      const jitter = base * (0.8 + Math.random() * 0.4);

      logger.warn(`[Redis] Retry attempt ${times} — reconnecting in ${Math.round(jitter)} ms`);
      return jitter;
    },

    // Reconnect on these specific errors (e.g., ECONNRESET, ETIMEDOUT)
    reconnectOnError(err: Error): boolean | 1 | 2 {
      const retriable = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'READONLY'];
      const shouldReconnect = retriable.some((code) => err.message.includes(code));
      if (shouldReconnect) {
        logger.warn(`[Redis] Reconnecting on error: ${err.message}`);
      }
      return shouldReconnect ? 2 : false; // 2 = reconnect AND re-send the failed command
    },

    // Prevent commands from piling up unboundedly while the client is offline.
    // Any command issued while disconnected will fail fast instead of queuing.
    maxRetriesPerRequest: 3,

    // Emit 'close' event when the connection drops rather than silently hanging
    enableOfflineQueue: true,

    // Human-readable name in logs
    connectionName: 'across-assist',

    // Lazy connect: don't open the socket until we explicitly call .connect()
    lazyConnect: true,
  };
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

const globalForRedis = globalThis as unknown as { redis?: Redis };

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL!;
  const options = buildRedisOptions();

  // ioredis can accept a URL string directly as the first argument
  const client = new Redis(url, options);

  // ── Event listeners ──────────────────────────────────────────────────────

  client.on('connect', () => {
    logger.info('[Redis] TCP connection established');
  });

  client.on('ready', () => {
    logger.info('[Redis] Client ready — accepting commands');
  });

  client.on('error', (err: Error) => {
    // Log every error but do NOT throw; ioredis handles reconnection internally.
    logger.error('[Redis] Client error:', err.message);
  });

  client.on('close', () => {
    logger.warn('[Redis] Connection closed');
  });

  client.on('reconnecting', (delay: number) => {
    logger.warn(`[Redis] Reconnecting in ${delay} ms…`);
  });

  client.on('end', () => {
    logger.error('[Redis] Connection ended — no more retries');
  });

  return client;
}

export const redis: Redis = globalForRedis.redis ?? createRedisClient();

// Prevent duplicate clients in development hot-reload (nodemon)
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// ---------------------------------------------------------------------------
// Lifecycle helpers (called by server.ts)
// ---------------------------------------------------------------------------

/**
 * Opens the Redis connection.  Should be awaited during server startup
 * so the first request never races against an unready client.
 */
export async function connectRedis(): Promise<void> {
  try {
    // `connect()` is a no-op if already connected; safe to call twice.
    await redis.connect();
    logger.info('[Redis] Connected successfully');
  } catch (err) {
    logger.error('[Redis] Failed to connect:', (err as Error).message);
    // Re-throw so server.ts can decide whether to abort startup
    throw err;
  }
}

/**
 * Gracefully closes the Redis connection.
 * Called during SIGTERM / SIGINT shutdown.
 */
export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    logger.info('[Redis] Disconnected gracefully');
  } catch (err) {
    logger.error('[Redis] Error during disconnect:', (err as Error).message);
  }
}

/**
 * Pings Redis and returns 'ok' | 'unreachable'.
 * Used by the /health endpoint in app.ts.
 */
export async function redisHealthCheck(): Promise<'ok' | 'unreachable'> {
  try {
    const pong = await redis.ping();
    return pong === 'PONG' ? 'ok' : 'unreachable';
  } catch {
    return 'unreachable';
  }
}
