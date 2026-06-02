const { Testimonial } = require('../models/Testimonial');

// ── CREATE  →  POST /api/testimonial ───────────────────────────
exports.createTestimonial = async (req, res) => {
  try {
    const { name, designation, review, rating, order } = req.body;
    const image = req.file ? req.file.path : '';

    const testimonial = await Testimonial.create({
      name,
      designation,
      review,
      rating,
      order,
      image,
    });

    res
      .status(201)
      .json({
        success: true,
        message: 'Testimonial created',
        data: testimonial,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL (Frontend)  →  GET /api/testimonial ─────────────────
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL (Admin)  →  GET /api/testimonial/admin/all ──────────
exports.getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET SINGLE  →  GET /api/testimonial/:id ─────────────────────
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE  →  PUT /api/testimonial/:id ─────────────────────────
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, designation, review, rating, order, isActive } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updateData = { name, designation, review, rating, order, isActive };
    if (image) updateData.image = image;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!testimonial)
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });

    res
      .status(200)
      .json({
        success: true,
        message: 'Testimonial updated',
        data: testimonial,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE  →  DELETE /api/testimonial/:id ──────────────────────
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial)
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });

    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
