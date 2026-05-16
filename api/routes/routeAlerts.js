/**
 * /api/route-alerts — Passenger subscriptions to route updates.
 */

import express from 'express';
import RouteAlert from '../models/RouteAlert.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/route-alerts
 * Subscribe to alerts for a specific route.
 */
router.post('/', async (req, res) => {
  try {
    const { fromCode, toCode, contact, contactType } = req.body;

    if (!contactType) {
      // Auto-detect
      const detected = /@/.test(contact) ? 'email' : 'phone';
      req.body.contactType = detected;
    }

    const alert = await RouteAlert.create(req.body);
    res.status(201).json({
      success: true,
      data: { id: alert._id, route: `${alert.fromCode} → ${alert.toCode}` },
      message: "You're subscribed. We'll send updates only when something changes on this route.",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "You're already subscribed to this route with that contact.",
      });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error('POST /api/route-alerts error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/route-alerts
 * Admin — list all subscriptions.
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const alerts = await RouteAlert.find({ active: true }).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    console.error('GET /api/route-alerts error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
