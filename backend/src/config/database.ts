import { prisma } from '../lib/prisma';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info(`Database connected: ${env.DATABASE_URL.split('@')[1] ?? 'local'}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected.');
  } catch (error) {
    logger.error('Database disconnection error:', error);
  }
};
