import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './lib/prisma';
import { redisHealthCheck } from './lib/redis';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { apiRouter } from './routes';

const app: Application = express();

// Trust proxy for Render/Vercel (fixes rate-limit warning)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// HTTP request logging
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
    skip: () => env.NODE_ENV === 'test',
  }),
);

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'unreachable';
  }

  const redisStatus = await redisHealthCheck();

  const healthy = dbStatus === 'ok' && redisStatus === 'ok';
  const status  = healthy ? 200 : 503;

  res.status(status).json({
    status:  healthy ? 'ok' : 'degraded',
    db:      dbStatus,
    redis:   redisStatus,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(`/api/${env.API_VERSION}`, apiRouter);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
