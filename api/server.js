/**
 * Local development server.
 *
 * Vercel calls `api/index.js` directly as a serverless function. For local
 * dev with `npm run dev:api`, this file boots a regular Express HTTP server
 * on port 3001, which Vite's dev proxy points at.
 */

import dotenv from 'dotenv';
dotenv.config();

import app from './index.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Try: curl http://localhost:${PORT}/api`);
});
