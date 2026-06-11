const mongoose = require('mongoose');

// ══════════════════════════════════════════════
// PRODUCT  →  actual product (belongs to SubCategory → Category)
// ══════════════════════════════════════════════
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // top-level category
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory', // sub category
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    // discountPrice: {
    //   type: Number,
    //   default: 0,
    // },
    images: [
      {
        type: String, // multiple images array
      },
    ],
    model: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // stock: {
    //   type: Number,
    //   default: 0,
    // },
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],

    // ✅ NEW
    features: [
      {
        type: String, // e.g. "Fully Automatic System"
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false, // homepage pe featured products
    },
  },
  { timestamps: true },
);

exports.Product = mongoose.model('Product', ProductSchema);
