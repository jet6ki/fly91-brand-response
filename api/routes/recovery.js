/**
 * /api/recovery — Customer recovery pipeline endpoints.
 *
 * All admin-only. Maps to the four-step framework in the PR strategy doc.
 */

import express from 'express';
import RecoveryCase from '../models/RecoveryCase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAdmin);

/**
 * POST /api/recovery
 * Log a new unhappy customer.
 */
router.post('/', async (req, res) => {
  try {
    const recoveryCase = await RecoveryCase.create(req.body);
    res.status(201).json({ success: true, data: recoveryCase });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error('POST /api/recovery error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/recovery
 * List recovery cases. Filterable by stage.
 */
router.get('/', async (req, res) => {
  try {
    const { stage, limit = 50 } = req.query;
    const query = stage ? { stage } : {};

    const cases = await RecoveryCase.find(query)
      .sort({ updatedAt: -1 })
      .limit(Math.min(Number(limit), 200));

    res.json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (err) {
    console.error('GET /api/recovery error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * PATCH /api/recovery/:id
 * Advance a case through the pipeline (update stage, log outreach, etc).
 */
router.patch('/:id', async (req, res) => {
  try {
    const recoveryCase = await RecoveryCase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!recoveryCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({ success: true, data: recoveryCase });
  } catch (err) {
    console.error('PATCH /api/recovery/:id error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/recovery/stats
 * Pipeline summary stats for the dashboard.
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await RecoveryCase.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ]);
    const counts = stats.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});
    res.json({ success: true, data: counts });
  } catch (err) {
    console.error('GET /api/recovery/stats error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
