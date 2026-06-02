const mongoose = require('mongoose');

const WarrantySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerContact: {
      type: String,
      required: true,
    },

    // ── Clinic Info ────────────────────────────────────────────
    clinicName: {
      type: String,
      required: true,
      trim: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },

    // ── Product Info ───────────────────────────────────────────
    purchaseDate: {
      type: Date,
      required: true,
    },
    productModel: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true, // ek serial number ek baar hi register ho sakta
    },
    productImage: {
      type: String, // uploaded image path
      default: '',
    },

    // ── Dealer Info ────────────────────────────────────────────
    dealerName: {
      type: String,
      required: true,
    },
    dealerCompany: {
      type: String,
      required: true,
    },
    dealerContact: {
      type: String,
      required: true,
    },
    dealerAddress: {
      type: String,
      required: true,
    },

    // ── Status ─────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true },
);

exports.Warranty = mongoose.model('Warranty', WarrantySchema);
