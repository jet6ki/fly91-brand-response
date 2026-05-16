/**
 * MongoDB connection helper with connection caching for Vercel serverless.
 *
 * Serverless functions are stateless across invocations, but Vercel keeps
 * the runtime warm between requests. Caching the connection on the global
 * object avoids reconnecting on every request, which would exhaust the
 * MongoDB Atlas connection pool quickly.
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    '⚠ MONGODB_URI is not set. Database operations will fail. ' +
    'Set it in .env (local) or Vercel project environment variables (prod).'
  );
}

// Cache connection across invocations to avoid pool exhaustion
let cached = global.__mongooseCache;
if (!cached) {
  cached = global.__mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
