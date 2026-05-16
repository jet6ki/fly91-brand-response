/**
 * Testimonial model — passenger-submitted stories.
 *
 * Site visitors submit short testimonials (text + optional video URL).
 * Each goes through moderation (pending → approved/rejected) before
 * appearing on the public site.
 */

import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    route: {
      type: String,
      trim: true,
      maxlength: 30,
      match: [
        /^[A-Z]{3}\s*[→\-\s]\s*[A-Z]{3}$/i,
        'Route must look like "BLR → SDW"',
      ],
    },
    story: {
      type: String,
      required: [true, 'Story is required'],
      trim: true,
      minlength: 20,
      maxlength: 800,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isFirstFlight: {
      type: Boolean,
      default: false,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    moderationNotes: String,
    moderatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index — public listing queries approved + sorted by recency
TestimonialSchema.index({ status: 1, createdAt: -1 });

// Helper: redact sensitive moderation data for public responses
TestimonialSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    route: this.route,
    story: this.story,
    rating: this.rating,
    isFirstFlight: this.isFirstFlight,
    createdAt: this.createdAt,
  };
};

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
