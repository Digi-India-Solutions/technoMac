const mongoose = require('mongoose');

const CatalogueDownloadSchema = new mongoose.Schema(
  {
    catalogueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Catalogue',
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('CatalogueDownload', CatalogueDownloadSchema);
