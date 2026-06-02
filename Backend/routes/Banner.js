const express = require('express');

const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const {
  createBanner,
  getAllBanner,
  deleteBanner,
  updateBanner,
} = require('../controller/Banner');
const upload = require('../middleware/multer');

// CREATE
router.post('/create', adminAuth, upload.single('image'), createBanner);

// GET ALL
router.get('/all', getAllBanner);

// DELETE
router.delete('/delete/:id', adminAuth, deleteBanner);

// UPDATE
router.patch('/update/:id', adminAuth, updateBanner);

module.exports = router;
