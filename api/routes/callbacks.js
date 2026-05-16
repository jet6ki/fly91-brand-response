/**
 * /api/callbacks — Telentir callback request endpoints.
 */

import express from 'express';
import Callback from '../models/Callback.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/callbacks
 * Submit a new callback request. Public endpoint, used by the Telentir
 * widget on the redesigned Fly91 site.
 */
router.post('/', async (req, res) => {
  try {
    const { countryCode, phoneNumber, reason, language, flightNumber } = req.body;

    const callback = await Callback.create({
      countryCode,
      phoneNumber,
      reason,
      language,
      flightNumber,
    });

    res.status(201).json({
      success: true,
      data: {
        id: callback._id,
        estimatedCallbackMinutes: 2,
        createdAt: callback.createdAt,
      },
      message: "We'll call you back in under 2 minutes.",
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error('POST /api/callbacks error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/callbacks?status=pending
 * Admin-only. Returns callback queue, newest first.
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const query = status ? { status } : {};

    const callbacks = await Callback.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit), 200));

    res.json({
      success: true,
      count: callbacks.length,
      data: callbacks,
    });
  } catch (err) {
    console.error('GET /api/callbacks error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * PATCH /api/callbacks/:id
 * Admin-only. Update callback status and notes (mark as completed,
 * record outcome, etc.)
 */
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (status === 'completed') update.completedAt = new Date();

    const callback = await Callback.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!callback) {
      return res.status(404).json({ success: false, error: 'Callback not found' });
    }

    res.json({ success: true, data: callback });
  } catch (err) {
    console.error('PATCH /api/callbacks/:id error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
