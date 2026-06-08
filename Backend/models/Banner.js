const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema(
  {
     categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required:true,

  },
    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Banner', BannerSchema);
