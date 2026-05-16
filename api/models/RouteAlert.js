/**
 * RouteAlert model — passenger subscriptions to route-specific updates.
 *
 * Maps to the "Get route alerts" CTAs on each destination card. When a
 * matching flight is added, delayed, or cancelled, all matching alerts
 * get notified (in production via Telentir / SMS / email).
 */

import mongoose from 'mongoose';

const RouteAlertSchema = new mongoose.Schema(
  {
    fromCode: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    toCode: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    contact: {
      type: String,
      required: [true, 'Phone or email required'],
      trim: true,
    },
    contactType: {
      type: String,
      enum: ['phone', 'email'],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by route
RouteAlertSchema.index({ fromCode: 1, toCode: 1, active: 1 });

// Prevent duplicate subscriptions (same contact on same route)
RouteAlertSchema.index(
  { fromCode: 1, toCode: 1, contact: 1 },
  { unique: true }
);

export default mongoose.models.RouteAlert || mongoose.model('RouteAlert', RouteAlertSchema);
