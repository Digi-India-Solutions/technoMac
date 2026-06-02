const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // multer — already bana hua hai

const {
  registerWarranty,
  getAllWarranties,
  getWarrantyById,
  checkWarrantyBySerial,
  updateWarrantyStatus,
  deleteWarranty,
} = require('../controller/Warrenty');

// ── Public Routes (koi bhi use kar sakta hai) ──────────────────
router.post('/register', upload.single('productImage'), registerWarranty);
router.get('/check/:serialNumber', checkWarrantyBySerial);

// ── Admin Routes ───────────────────────────────────────────────
router.get('/', getAllWarranties);
router.get('/:id', getWarrantyById);
router.put('/:id/status', updateWarrantyStatus);
router.delete('/:id', deleteWarranty);

module.exports = router;
