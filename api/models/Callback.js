/**
 * Callback model — Telentir voice-support callback requests.
 *
 * When a passenger submits the "Request a call" form on the Fly91 site,
 * we persist the request here. The Telentir voice AI system polls/streams
 * pending callbacks and places outbound calls within ~2 minutes.
 */

import mongoose from 'mongoose';

const CallbackSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      default: '+91',
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{6,15}$/, 'Phone number must be 6-15 digits'],
    },
    reason: {
      type: String,
      required: true,
      enum: {
        values: [
          'delay_or_schedule_change',
          'first_time_flying',
          'rebook_or_cancel',
          'incident_followup',
          'other',
        ],
        message: 'Invalid reason: {VALUE}',
      },
    },
    language: {
      type: String,
      required: true,
      enum: ['en', 'hi', 'mr', 'kn', 'te', 'ml'],
      default: 'en',
    },
    flightNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual: full phone number
CallbackSchema.virtual('fullPhone').get(function () {
  return `${this.countryCode}${this.phoneNumber}`;
});

// Virtual: human-readable language name
CallbackSchema.virtual('languageName').get(function () {
  const map = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    kn: 'Kannada',
    te: 'Telugu',
    ml: 'Malayalam',
  };
  return map[this.language] || this.language;
});

// Index for the admin dashboard's pending queue
CallbackSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Callback || mongoose.model('Callback', CallbackSchema);
