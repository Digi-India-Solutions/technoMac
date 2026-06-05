const express = require('express');

const router = express.Router();

const {
  createContact,
  getAllContacts,
  deleteContact,
} = require('../controller/Contact');

const adminAuth = require('../middleware/adminAuth');

// Public Form Submit
router.post('/create', createContact);

// Admin Only
router.get('/all',  getAllContacts);  

router.delete('/delete/:id', adminAuth, deleteContact);

module.exports = router;
