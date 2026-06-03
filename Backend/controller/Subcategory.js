const { SubCategory } = require('../models/Subcategory ');
const cloudinary = require('../config/cloudinary');
// ── CREATE ──────────────────────────────────────────────────────
exports.createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    let imageUrl = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'subcategories' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const subCategory = await SubCategory.create({
      name,
      category,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'SubCategory created',
      data: subCategory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ── GET ALL ─────────────────────────────────────────────────────
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({ isActive: true })
      .populate('category', 'name image') // category ka naam bhi aayega
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: subCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET BY CATEGORY ID — ek category ki saari subcategories ─────
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate('category', 'name');

    res.status(200).json({ success: true, data: subCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE ──────────────────────────────────────────────────
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      'category',
      'name',
    );
    if (!subCategory)
      return res.status(404).json({ message: 'SubCategory not found' });

    res.status(200).json({ success: true, data: subCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ──────────────────────────────────────────────────────
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, category, description, isActive } = req.body;

    const updateData = {
      name,
      category,
      description,
      isActive,
    };

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'subcategories' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      updateData.image = result.secure_url;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      },
    );

    if (!subCategory) {
      return res.status(404).json({
        message: 'SubCategory not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'SubCategory updated',
      data: subCategory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ── DELETE ──────────────────────────────────────────────────────
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory)
      return res.status(404).json({ message: 'SubCategory not found' });

    res.status(200).json({ success: true, message: 'SubCategory deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
