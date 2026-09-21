const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema(
  {
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentCategory',
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: false,
    },

    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'all'],
      default: 'desktop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Performance Indexes
BannerSchema.index({ isActive: 1, createdAt: -1 });
BannerSchema.index({ parentCategoryId: 1, isActive: 1 });
BannerSchema.index({ categoryId: 1, isActive: 1 });

module.exports = mongoose.model('Banner', BannerSchema);
