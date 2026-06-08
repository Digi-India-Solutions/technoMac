const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');
const {
  createBanner,
  getAllBanner,
  deleteBanner,
  updateBanner,
  getBannerByCategory,
} = require('../controller/Banner');

// CREATE
router.post('/create', adminAuth, upload.single('image'), createBanner);

// GET ALL
router.get('/all', getAllBanner);

// GET BY CATEGORY
router.get('/category/:categoryId', adminAuth, getBannerByCategory);

// UPDATE — support both PUT and PATCH so frontend patchData works
router.put('/update/:id', adminAuth, upload.single('image'), updateBanner);
router.patch('/update/:id', adminAuth, upload.single('image'), updateBanner); // FIX: frontend uses patchData (PATCH)

// DELETE
router.delete('/delete/:id', adminAuth, deleteBanner);

module.exports = router;
