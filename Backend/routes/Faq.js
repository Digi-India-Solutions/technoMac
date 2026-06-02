const express = require('express');
const router = express.Router();
const {
  createFAQ,
  getAllFAQs,
  getAllFAQsAdmin,
  getFAQById,
  updateFAQ,
  deleteFAQ,
} = require('../controller/Faq');

router.post('/', createFAQ); // create
router.get('/', getAllFAQs); // frontend ke liye (sirf active)
router.get('/admin/all', getAllFAQsAdmin); // admin ke liye (sab)
router.get('/:id', getFAQById); // single
router.put('/:id', updateFAQ); // update
router.delete('/:id', deleteFAQ); // delete

module.exports = router;
