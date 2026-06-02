const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g. "Dr. Amit Sharma"
    },
    designation: {
      type: String,
      required: true,
      trim: true, // e.g. "MDS Orthodontist"
    },
    review: {
      type: String,
      required: true, // testimonial text
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
      default: '', // profile photo path
    },
    order: {
      type: Number,
      default: 0, // display sequence control
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

exports.Testimonial = mongoose.model('Testimonial', TestimonialSchema);
