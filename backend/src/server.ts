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
  logger.info('🚀 Starting server initialization...');

  // Start listening on 0.0.0.0 (required for Render)
  server.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on 0.0.0.0:${env.PORT}`);
    logger.info(`API Base: http://0.0.0.0:${env.PORT}/api/${env.API_VERSION}`);
  });

  try {
    logger.info('[Database] Connecting...');
    await connectDatabase();
    logger.info('[Database] ✅ Connected');
  } catch (err) {
    logger.error('[Database] ❌ Connection failed:', (err as Error).message);
  }

  try {
    logger.info('[Redis] Connecting...');
    await connectRedis();
    logger.info('[Redis] ✅ Connected');
  } catch (err) {
    logger.warn('[Redis] ⚠️ Could not connect at startup — OTP features will be degraded:', (err as Error).message);
  }

  startAbandonmentCron();
  logger.info('✅ Abandonment cron jobs started');
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

