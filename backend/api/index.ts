import type { Request, Response } from 'express';
import app, { initAppData } from '../src/server';
import { connectDB } from '../src/config/db';

export default async function handler(req: Request, res: Response) {
  try {
    // 1. Ensure database connection is cached and ready before handling request
    await connectDB();

    // 2. Ensure initial services and superadmin are initialized in MongoDB Atlas
    await initAppData();

    // 3. Preserve original client path if modified by Vercel serverless rewrites
    const matchedPath = (req.headers['x-matched-path'] as string) || req.originalUrl;
    if (matchedPath && matchedPath !== '/api' && req.url === '/api') {
      req.url = matchedPath;
    } else if (req.originalUrl && req.url !== req.originalUrl) {
      req.url = req.originalUrl;
    }

    return app(req, res);
  } catch (error) {
    console.error('Serverless execution error:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverless execution error occurred',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
