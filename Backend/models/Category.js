const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // duplicate category nahi ban sakti
    },
    image: {
      type: String, // image URL / path
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

exports.Category = mongoose.model('Category', CategorySchema);
