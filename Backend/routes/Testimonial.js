const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
  createTestimonial,
  getAllTestimonials,
  getAllTestimonialsAdmin,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require('../controller/Testimonial');

router.post('/', upload.single('image'), createTestimonial);
router.get('/', getAllTestimonials); // frontend (sirf active)
router.get('/admin/all', getAllTestimonialsAdmin); // admin (sab)
router.get('/:id', getTestimonialById);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
