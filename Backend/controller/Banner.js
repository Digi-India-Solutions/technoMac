const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinary');

// CREATE BANNER
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, buttonText } = req.body;

    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // save in mongodb
    const banner = await Banner.create({
      title,

      subtitle,

      buttonText,

      image: result.secure_url,
    });

    res.status(201).json({
      success: true,

      banner,
    });
  } 
  catch (error) {
     console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL BANNERS
exports.getAllBanner = async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
    });

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

// UPDATE BANNER
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
