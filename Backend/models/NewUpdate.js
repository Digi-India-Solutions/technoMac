const mongoose = require('mongoose');

const NewUpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    points: {
      type: [String], // Array of bullet points e.g. ["Premium comfort", "LED light"]
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('NewUpdate', NewUpdateSchema);