import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import apiRouter from './routes';
import { errorHandler, AppError } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { sanitizeNoSQL } from './middleware/sanitize';
import { BlogPost, Service, AdminUser } from './models';
import { seedDatabase } from './seeds/seed';
import { seedKnowledgeIntelligence } from './seeds/seed_knowledge_intelligence';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable reverse proxy trust for Vercel, Cloudflare, and AWS ALB
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https:', 'wss:', 'http://localhost:*']
      }
    },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: true,
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true
  })
);

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CORS_ORIGIN || '',
  process.env.NEXT_PUBLIC_APP_URL || ''
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any Vercel deployment preview or production domain for this project
      if (origin.endsWith('.vercel.app') || origin.includes('solonomous')) {
        return callback(null, true);
      }

      // In non-production, permit all for frictionless development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      callback(new AppError(`Origin ${origin} not allowed by CORS policy`, 403));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL operator injection sanitizer
app.use(sanitizeNoSQL);

// Apply rate limiter to general API routes
app.use('/api', generalLimiter);

// Mount API routes
app.use('/api/v1', apiRouter);

// Root health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    brand: 'SoloNomous Labs',
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/v1/health'
  });
});

// Handle 404 for unmapped API endpoints
app.all('*', (req: Request, res: Response, next) => {
  next(new AppError(`Endpoint ${req.originalUrl} not found on SoloNomous Labs API`, 404));
});

// Global Central Error Handler
app.use(errorHandler);

// Initialize core data (services & superadmin) if missing; supports both serverless cold-starts and standalone mode
let isInitialized = false;
let initPromise: Promise<void> | null = null;

export const initAppData = async (): Promise<void> => {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Auto-seed knowledge intelligence & 14 official services if database is fresh or needs expansion
      const serviceCount = await Service.countDocuments();
      if (serviceCount < 14) {
        console.log('📦 Synchronizing Knowledge Intelligence & 14 Official Services...');
        await seedKnowledgeIntelligence();
      }

      // Ensure Master Superadmin Account is permanently provisioned for Noman Nawaz
      const masterEmail = 'nawaznoman7766@gmail.com';
      const masterPass = '@Noman668626';
      const existingSuperadmin = await AdminUser.findOne({ email: masterEmail });
      const passwordHash = await bcrypt.hash(masterPass, 12);

      if (!existingSuperadmin) {
        await AdminUser.create({
          name: 'Noman Nawaz',
          email: masterEmail,
          passwordHash,
          role: 'superadmin',
          permissions: {
            canManageLeads: true,
            canManageBlog: true,
            canManageServices: true,
            canManageCaseStudies: true,
            canManageKnowledge: true,
            canManageSettings: true,
            canManageTeam: true
          },
          active: true
        });
        console.log(`🔐 Master Superadmin provisioned for: ${masterEmail}`);
      } else {
        existingSuperadmin.passwordHash = passwordHash;
        existingSuperadmin.role = 'superadmin';
        existingSuperadmin.active = true;
        existingSuperadmin.permissions = {
          canManageLeads: true,
          canManageBlog: true,
          canManageServices: true,
          canManageCaseStudies: true,
          canManageKnowledge: true,
          canManageSettings: true,
          canManageTeam: true
        };
        await existingSuperadmin.save();
        console.log(`🔐 Master Superadmin credentials synced for: ${masterEmail}`);
      }

      isInitialized = true;
    } catch (err) {
      console.error('Initialization error during DB sync:', err);
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
};

// Bootstrap server (only in standalone mode, not inside Vercel serverless function)
export const startServer = async () => {
  try {
    await connectDB();
    await initAppData();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`⚡ SoloNomous Labs Backend API Running`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🛡️ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`======================================================\n`);
    });

    const shutdown = () => {
      console.log('Stopping server gracefully...');
      server.close(() => {
        console.log('SoloNomous Labs backend stopped.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
};

// If not on Vercel and not in test, start standalone server
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
