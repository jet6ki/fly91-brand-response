/**
 * /api/flights — Live flight data endpoints.
 *
 * Powers the live flight tracker on the redesigned Fly91 site.
 * The frontend polls GET /api/flights/live every 60 seconds.
 */

import express from 'express';
import Flight from '../models/Flight.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/flights/live
 * Returns flights currently in the air, boarding, or scheduled for the
 * next few hours. Sorted by departure time.
 */
router.get('/live', async (req, res) => {
  try {
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const flights = await Flight.find({
      $or: [
        { status: { $in: ['in_air', 'boarding', 'delayed'] } },
        {
          status: 'scheduled',
          departureTime: { $lte: fourHoursFromNow },
        },
        {
          status: 'landed',
          arrivalTime: { $gte: new Date(now.getTime() - 60 * 60 * 1000) },
        },
      ],
    })
      .sort({ departureTime: 1 })
      .limit(20);

    res.json({
      success: true,
      count: flights.length,
      lastUpdated: now.toISOString(),
      data: flights,
    });
  } catch (err) {
    console.error('GET /api/flights/live error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

/**
 * POST /api/flights/seed
 * Admin endpoint — seed the database with realistic Fly91 route data.
 * Call this once after setting up MongoDB to populate the tracker.
 */
router.post('/seed', requireAdmin, async (req, res) => {
  try {
    await Flight.deleteMany({});

    const now = new Date();
    const minutes = (n) => new Date(now.getTime() + n * 60000);

    const seed = [
      { flightNumber: 'IC 1401', fromCode: 'HYD', fromCity: 'Hyderabad', toCode: 'HBX', toCity: 'Hubballi',
        departureTime: minutes(-50), arrivalTime: minutes(20), status: 'in_air' },
      { flightNumber: 'IC 2108', fromCode: 'BLR', fromCity: 'Bengaluru', toCode: 'SDW', toCity: 'Sindhudurg',
        departureTime: minutes(-30), arrivalTime: minutes(50), status: 'in_air' },
      { flightNumber: 'IC 3301', fromCode: 'GOX', fromCity: 'Goa', toCode: 'AGX', toCity: 'Agatti',
        departureTime: minutes(15), arrivalTime: minutes(105), status: 'boarding', gate: 'Gate 3 · Mopa' },
      { flightNumber: 'IC 1378', fromCode: 'GOX', fromCity: 'Goa', toCode: 'PNQ', toCity: 'Pune',
        departureTime: minutes(70), arrivalTime: minutes(140), status: 'delayed', delayMinutes: 45 },
      { flightNumber: 'IC 4021', fromCode: 'HYD', fromCity: 'Hyderabad', toCode: 'VGA', toCity: 'Vijayawada',
        departureTime: minutes(-120), arrivalTime: minutes(-15), status: 'landed' },
      { flightNumber: 'IC 2205', fromCode: 'PNQ', fromCity: 'Pune', toCode: 'JLG', toCity: 'Jalgaon',
        departureTime: minutes(105), arrivalTime: minutes(170), status: 'scheduled', gate: 'Gate 7 · Pune' },
      { flightNumber: 'IC 3402', fromCode: 'SSE', fromCity: 'Solapur', toCode: 'GOX', toCity: 'Goa',
        departureTime: minutes(-40), arrivalTime: minutes(20), status: 'in_air' },
    ];

    const created = await Flight.insertMany(seed);
    res.json({
      success: true,
      count: created.length,
      message: `Seeded ${created.length} flights.`,
    });
  } catch (err) {
    console.error('POST /api/flights/seed error:', err);
    res.status(500).json({ success: false, error: 'Server error', details: err.message });
  }
});

export default router;
