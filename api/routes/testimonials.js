/**
 * /api/testimonials — Passenger testimonial endpoints.
 *
 * Public endpoints serve only approved testimonials. Admin endpoints
 * expose the full set including pending moderation queue.
 */

import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/testimonials
 * Submit a new testimonial. Lands in pending status until moderated.
 */
router.post('/', async (req, res) => {
  try {
    const { name, route, story, rating, isFirstFlight, videoUrl } = req.body;

    const testimonial = await Testimonial.create({
      name,
      route,
      story,
      rating,
      isFirstFlight,
      videoUrl,
    });

    res.status(201).json({
      success: true,
      data: {
        id: testimonial._id,
        status: 'pending',
        message: 'Thank you. Your story is being reviewed and will appear on the site soon.',
      },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error('POST /api/testimonials error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/testimonials
 * Public endpoint — approved only, with public projection.
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const testimonials = await Testimonial.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit), 50));

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials.map((t) => t.toPublicJSON()),
    });
  } catch (err) {
    console.error('GET /api/testimonials error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * GET /api/testimonials/admin
 * Admin endpoint — all testimonials including pending.
 */
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const query = status ? { status } : {};

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit), 200));

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    console.error('GET /api/testimonials/admin error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * PATCH /api/testimonials/:id
 * Admin — approve or reject a testimonial.
 */
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, moderationNotes } = req.body;

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be pending | approved | rejected',
      });
    }

    const update = { moderatedAt: new Date() };
    if (status) update.status = status;
    if (moderationNotes !== undefined) update.moderationNotes = moderationNotes;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, error: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (err) {
    console.error('PATCH /api/testimonials/:id error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
