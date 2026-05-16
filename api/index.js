/**
 * Express API entry point — runs as a Vercel serverless function.
 *
 * All `/api/*` requests are routed here (see vercel.json rewrites).
 * Connects to MongoDB lazily on first request, caches the connection
 * across invocations.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/db.js';
import callbacksRouter from './routes/callbacks.js';
import testimonialsRouter from './routes/testimonials.js';
import flightsRouter from './routes/flights.js';
import recoveryRouter from './routes/recovery.js';
import routeAlertsRouter from './routes/routeAlerts.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Lazy DB connection on first request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(503).json({
      success: false,
      error: 'Database unavailable',
      hint: 'Check MONGODB_URI environment variable is set correctly.',
    });
  }
});

// Health check
app.get('/api', (req, res) => {
  res.json({
    success: true,
    service: 'Fly91 Brand Response API',
    version: '1.0.0',
    endpoints: [
      'GET /api',
      'GET /api/health',
      'POST /api/callbacks',
      'GET /api/callbacks (admin)',
      'PATCH /api/callbacks/:id (admin)',
      'POST /api/testimonials',
      'GET /api/testimonials',
      'GET /api/testimonials/admin (admin)',
      'PATCH /api/testimonials/:id (admin)',
      'GET /api/flights/live',
      'POST /api/flights/seed (admin)',
      'POST /api/recovery (admin)',
      'GET /api/recovery (admin)',
      'GET /api/recovery/stats (admin)',
      'PATCH /api/recovery/:id (admin)',
      'POST /api/route-alerts',
      'GET /api/route-alerts (admin)',
    ],
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    dbConnected: !!(globalThis.__mongooseCache?.conn),
    timestamp: new Date().toISOString(),
  });
});

// Mount routers
app.use('/api/callbacks', callbacksRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/recovery', recoveryRouter);
app.use('/api/route-alerts', routeAlertsRouter);

// 404 fallback
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
