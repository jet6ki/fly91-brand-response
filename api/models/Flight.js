/**
 * Flight model — live flight tracker data.
 *
 * Seeded with realistic Fly91 routes (BLR, HYD, GOX, SDW, PNQ, etc).
 * Status values mirror real airline operational states.
 *
 * In production, this would be synced from Fly91's operations system
 * (ACARS, ADS-B, or a flight-status API). For the demo, we seed it
 * with representative data and expose a GET /api/flights endpoint
 * the live tracker on the site polls every 60s.
 */

import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
      match: [/^IC\s*\d{3,4}$/i, 'Flight number must look like "IC 3401"'],
    },
    aircraft: {
      type: String,
      default: 'ATR 72-600',
    },
    fromCode: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    fromCity: {
      type: String,
      required: true,
    },
    toCode: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    toCity: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'boarding', 'in_air', 'landed', 'delayed', 'cancelled', 'diverted'],
      default: 'scheduled',
      index: true,
    },
    delayMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    gate: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for live tracker queries
FlightSchema.index({ status: 1, departureTime: 1 });

// Virtual: formatted route (e.g., "BLR → SDW")
FlightSchema.virtual('route').get(function () {
  return `${this.fromCode} → ${this.toCode}`;
});

FlightSchema.set('toJSON', { virtuals: true });

export default mongoose.models.Flight || mongoose.model('Flight', FlightSchema);
