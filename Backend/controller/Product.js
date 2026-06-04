
const cloudinary = require('../config/cloudinary');
const { Product } = require('../models/Product');

// ── CREATE ──────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      model,
      description,
      price,
      discountPrice,
      stock,
      features,
      specifications,
      isFeatured,
    } = req.body;

    // Multiple images — multer array se
    let images = [];

    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: 'products' }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                })
                .end(file.buffer);
            }),
        ),
      );
    }

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

    // ✅ Features parse
    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures =
          typeof features === 'string' ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = [];
      }
    }

    const existingProduct = await Product.findOne({ model });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this model already exists',
      });
    }

    const product = await Product.create({
      name,
      category,
      subCategory,
      model,
      description,
      price,
      discountPrice,
      stock,
      images,
      specifications: parsedSpecs,
      features: parsedFeatures,
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
      model,
      subCategory,
      description,
      price,
      discountPrice,
      features,
      stock,
      specifications,
      isFeatured,
      isActive,
    } = req.body;

    let images;

    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: 'products' }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result.secure_url);
                })
                .end(file.buffer);
            }),
        ),
      );
    }

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
    // ✅ Features parse
    let parsedFeatures;
    if (features) {
      try {
        parsedFeatures =
          typeof features === 'string' ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = undefined;
      }
    }

    const updateData = {
      name,
      category,
      model,
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
    if (parsedFeatures) updateData.features = parsedFeatures;  

    if (model) {
      const existingProduct = await Product.findOne({
        model,
        _id: { $ne: req.params.id }, // current product ko ignore karo
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this model already exists',
        });
      }
    }

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

// ── SEARCH WITH PAGINATION ──────────────────────────────────────
// GET /product/search?q=&category=&subCategory=&minPrice=&maxPrice=&page=&limit=
exports.searchProducts = async (req, res) => {
  try {
    const {
      q,           // name ya model se search
      category,    // category id
      subCategory, // subCategory id
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    // ── Build filter object ──────────────────────────────────────
    const filter = { isActive: true };

    // Name OR Model mein text search
    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { model: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category.trim()) {
      filter.category = category.trim();
    }

    // SubCategory filter
    if (subCategory && subCategory.trim()) {
      filter.subCategory = subCategory.trim();
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ── Pagination ───────────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // max 100, default 20
    const skip     = (pageNum - 1) * limitNum;

    // ── Query ────────────────────────────────────────────────────
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
