const express = require('express');
const router = express.Router();

const multer = require('multer');
const catalogueController = require('../controller/Catalogue');

// multer — memory storage (same as banner setup)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// fields: image (cover) + pdfFile (optional PDF)
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 },
]);

// POST   /api/catalogue/create   → createCatalogue
router.post('/create', uploadFields, catalogueController.createCatalogue);

// GET    /api/catalogue/all      → getAllCatalogues
router.get('/all', catalogueController.getAllCatalogues);

// GET    /api/catalogue/:id      → getCatalogueById
router.get('/:id', catalogueController.getCatalogueById);

// PUT    /api/catalogue/:id      → updateCatalogue
router.put('/:id', uploadFields, catalogueController.updateCatalogue);

// DELETE /api/catalogue/:id      → deleteCatalogue
router.delete('/:id', catalogueController.deleteCatalogue);

module.exports = router;
