const { Category } = require('../models/Category');

// ── CREATE ──────────────────────────────────────────────────────
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : ''; // multer se image

    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, description, image });

    res
      .status(201)
      .json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET ALL ─────────────────────────────────────────────────────
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE ──────────────────────────────────────────────────
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ──────────────────────────────────────────────────────
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updateData = { name, description, isActive };
    if (image) updateData.image = image;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    res
      .status(200)
      .json({ success: true, message: 'Category updated', data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE ──────────────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
