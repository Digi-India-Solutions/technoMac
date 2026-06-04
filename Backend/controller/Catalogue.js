const Catalogue = require('../models/Catalogue');
const cloudinary = require('../config/cloudinary');

// ── Helper: upload buffer to Cloudinary ───────────────────────
const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

// ── CREATE ────────────────────────────────────────────────────
// POST /api/catalogue/create
// Body (multipart): title, description, image (file), pdfFile (file, optional)
exports.createCatalogue = async (req, res) => {
  try {
    const { title, description } = req.body;

    // image required
    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: 'Cover image is required' });
    }

    // Upload cover image
    const imageResult = await uploadToCloudinary(imageFile.buffer, {
      folder: 'catalogues/images',
    });

    // Upload PDF (optional)
    let pdfUrl = '';
    const pdfFile = req.files?.pdfFile?.[0];
    if (pdfFile) {
      const pdfResult = await uploadToCloudinary(pdfFile.buffer, {
        folder: 'catalogues/pdfs',
        resource_type: 'raw',
        format: 'pdf',
      });
      pdfUrl = pdfResult.secure_url;
    }

    const catalogue = await Catalogue.create({
      title,
      description,
      image: imageResult.secure_url,
      pdfFile: pdfUrl,
    });

    res
      .status(201)
      .json({ success: true, message: 'Catalogue created', data: catalogue });
  } catch (error) {
    console.error('createCatalogue error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL ───────────────────────────────────────────────────
// GET /api/catalogue/all
exports.getAllCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: catalogues.length, data: catalogues });
  } catch (error) {
    console.error('getAllCatalogues error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL ACTIVE (for frontend/customer side) ───────────────
// GET /api/catalogue/active
exports.getActiveCatalogues = async (req, res) => {
  try {
    const catalogues = await Catalogue.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: catalogues.length, data: catalogues });
  } catch (error) {
    console.error('getActiveCatalogues error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET SINGLE ────────────────────────────────────────────────
// GET /api/catalogue/:id
exports.getCatalogueById = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res
        .status(404)
        .json({ success: false, message: 'Catalogue not found' });
    }
    res.status(200).json({ success: true, data: catalogue });
  } catch (error) {
    console.error('getCatalogueById error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────
// PUT /api/catalogue/:id
// Body (multipart): title?, description?, image? (file), pdfFile? (file), isActive?
exports.updateCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res
        .status(404)
        .json({ success: false, message: 'Catalogue not found' });
    }

    const { title, description, isActive } = req.body;

    // Update image if new one uploaded
    let imageUrl = catalogue.image;
    const imageFile = req.files?.image?.[0];
    if (imageFile) {
      const imageResult = await uploadToCloudinary(imageFile.buffer, {
        folder: 'catalogues/images',
      });
      imageUrl = imageResult.secure_url;
    }

    // Update PDF if new one uploaded
    let pdfUrl = catalogue.pdfFile;
    const pdfFile = req.files?.pdfFile?.[0];
    if (pdfFile) {
      const pdfResult = await uploadToCloudinary(pdfFile.buffer, {
        folder: 'catalogues/pdfs',
        resource_type: 'raw',
        format: 'pdf',
      });
      pdfUrl = pdfResult.secure_url;
    }

    const updated = await Catalogue.findByIdAndUpdate(
      req.params.id,
      {
        title: title || catalogue.title,
        description: description || catalogue.description,
        image: imageUrl,
        pdfFile: pdfUrl,
        ...(isActive !== undefined && {
          isActive: isActive === 'true' || isActive === true,
        }),
      },
      { new: true, runValidators: true },
    );

    res
      .status(200)
      .json({ success: true, message: 'Catalogue updated', data: updated });
  } catch (error) {
    console.error('updateCatalogue error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── TOGGLE STATUS ─────────────────────────────────────────────
// PATCH /api/catalogue/:id/toggle-status
exports.toggleStatus = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res
        .status(404)
        .json({ success: false, message: 'Catalogue not found' });
    }

    catalogue.isActive = !catalogue.isActive;
    await catalogue.save();

    res.status(200).json({
      success: true,
      message: `Catalogue ${catalogue.isActive ? 'activated' : 'deactivated'}`,
      data: catalogue,
    });
  } catch (error) {
    console.error('toggleStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────
// DELETE /api/catalogue/:id
exports.deleteCatalogue = async (req, res) => {
  try {
    const catalogue = await Catalogue.findById(req.params.id);
    if (!catalogue) {
      return res
        .status(404)
        .json({ success: false, message: 'Catalogue not found' });
    }

    await Catalogue.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: 'Catalogue deleted successfully' });
  } catch (error) {
    console.error('deleteCatalogue error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
