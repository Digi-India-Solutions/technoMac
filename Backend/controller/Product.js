const { Product } = require('../models/Product');

// ── CREATE ──────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      description,
      price,
      discountPrice,
      stock,
      specifications,
      isFeatured,
    } = req.body;

    // Multiple images — multer array se
    const images = req.files ? req.files.map((f) => f.path) : [];

    // specifications JSON string se parse karo (form-data mein string aata hai)
    let parsedSpecs = [];
    if (specifications) {
      try {
        parsedSpecs =
          typeof specifications === 'string'
            ? JSON.parse(specifications)
            : specifications;
      } catch {
        parsedSpecs = [];
      }
    }

    const product = await Product.create({
      name,
      category,
      subCategory,
      description,
      price,
      discountPrice,
      stock,
      images,
      specifications: parsedSpecs,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    res
      .status(201)
      .json({ success: true, message: 'Product created', data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET ALL ─────────────────────────────────────────────────────
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET BY CATEGORY ─────────────────────────────────────────────
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET BY SUBCATEGORY ──────────────────────────────────────────
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const products = await Product.find({
      subCategory: req.params.subCategoryId,
      isActive: true,
    })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE ──────────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('subCategory', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET FEATURED ────────────────────────────────────────────────
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ──────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      description,
      price,
      discountPrice,
      stock,
      specifications,
      isFeatured,
      isActive,
    } = req.body;

    const images =
      req.files && req.files.length > 0
        ? req.files.map((f) => f.path)
        : undefined;

    let parsedSpecs;
    if (specifications) {
      try {
        parsedSpecs =
          typeof specifications === 'string'
            ? JSON.parse(specifications)
            : specifications;
      } catch {
        parsedSpecs = undefined;
      }
    }

    const updateData = {
      name,
      category,
      subCategory,
      description,
      price,
      discountPrice,
      stock,
      isActive,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    };
    if (images) updateData.images = images;
    if (parsedSpecs) updateData.specifications = parsedSpecs;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res
      .status(200)
      .json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE ──────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
