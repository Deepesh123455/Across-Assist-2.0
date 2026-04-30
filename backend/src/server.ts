import 'dotenv/config';
import 'express-async-errors';
import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './lib/redis';
import { logger } from './utils/logger';
import { startAbandonmentCron } from './jobs/abandonmentCron';

const server = createServer(app);

const startServer = async () => {
  await connectDatabase();

  // Redis is non-fatal: if Upstash is temporarily unreachable we log a warning
  // but do NOT abort startup — routes that don't need OTP still work fine.
  try {
    await connectRedis();
  } catch (err) {
    logger.warn('[Redis] Could not connect at startup — OTP features will be degraded:', (err as Error).message);
  }

  server.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`API Base: http://localhost:${env.PORT}/api/${env.API_VERSION}`);
    startAbandonmentCron();
    logger.info('✅ Abandonment cron jobs started');
  });
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    await disconnectRedis();
    await disconnectDatabase();
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', async (error: Error) => {
  logger.error('Uncaught Exception:', error);
  await disconnectRedis();
  await disconnectDatabase();
  process.exit(1);
});

process.on('unhandledRejection', async (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  await disconnectRedis();
  await disconnectDatabase();
  process.exit(1);
});

startServer().catch(async (error) => {
  logger.error('Failed to start server:', error);
  await disconnectDatabase();
  process.exit(1);
});

