const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

// CREATE BANNER
// CREATE BANNER
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText, categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // ✅ upload from buffer (memoryStorage)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'banners' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    const banner = await Banner.create({
      categoryId,
      title,
      subtitle,
      buttonText,
      image: result.secure_url,
    });

    res.status(201).json({ success: true, banner });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL BANNERS
exports.getAllBanner = async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
    }).populate('categoryId',category)

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE BANNER
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Banner Deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBannerByCategory = async (req, res) => {
  try {
    const banners = await Banner.find({
      categoryId: req.params.categoryId,
      isActive: true,
    }).populate('categoryId');

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE BANNER
exports.updateBanner = async (req, res) => {
  try {
    const updateData = {
      categoryId: req.body.categoryId,
      title: req.body.title,
      subtitle: req.body.subtitle,
      buttonText: req.body.buttonText,
    };

    if (!req.body.categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    if (req.file) {
      // Upload from buffer instead of file path
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'banners' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer); // ← use buffer, not path
      });

      updateData.image = result.secure_url;
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({ success: true, banner });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
