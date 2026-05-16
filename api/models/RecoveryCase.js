/**
 * RecoveryCase model — customer recovery pipeline.
 *
 * Tracks vocal unhappy customers through the four-step identify → reach →
 * repair → convert framework from the PR strategy doc. The admin dashboard
 * exposes this as the "Customer Recovery Pipeline" view.
 */

import mongoose from 'mongoose';

const RecoveryCaseSchema = new mongoose.Schema(
  {
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    flightNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    source: {
      type: String,
      enum: ['twitter', 'instagram', 'email', 'phone', 'in_person', 'review_site', 'other'],
      required: true,
    },
    sourceLink: String,

    stage: {
      type: String,
      enum: ['identified', 'reached_out', 'repair_offered', 'converted', 'lost'],
      default: 'identified',
      index: true,
    },
    outreachNotes: String,
    repairAction: String,
    convertedStory: String, // If they become an advocate, store their testimonial
    advocateConsent: {
      type: Boolean,
      default: false,
    },

    ownedBy: String, // Which CX team member is on it
  },
  {
    timestamps: true,
  }
);

// Index for pipeline queries
RecoveryCaseSchema.index({ stage: 1, updatedAt: -1 });

export default mongoose.models.RecoveryCase || mongoose.model('RecoveryCase', RecoveryCaseSchema);
