const express = require('express');

const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const {
  createBanner,
  getAllBanner,
  deleteBanner,
  updateBanner,
  getBannerByCategory,
} = require('../controller/Banner');
const upload = require('../middleware/multer');

// CREATE
router.post('/create', adminAuth, upload.single('image'), createBanner);

router.get(
  '/banner/category/:categoryId', adminAuth,
  getBannerByCategory,
);

// GET ALL
router.get('/all', getAllBanner);

// DELETE
router.delete('/delete/:id', adminAuth, deleteBanner);

// UPDATE
router.put('/update/:id', adminAuth, upload.single('image'), updateBanner);

module.exports = router;
