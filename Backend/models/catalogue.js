const mongoose = require('mongoose');

const CatalogueSchema = new mongoose.Schema(
  {
    title: {
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
      type: String, // Cloudinary URL (cover image)
      required: true,
    },
    pdfFile: {
      type: String, // Cloudinary URL (raw PDF)
      default: '',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Catalogue', CatalogueSchema);
