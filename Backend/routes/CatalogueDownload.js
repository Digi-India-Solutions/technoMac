const express = require('express');
const router = express.Router();

const CatalogueDownloadController = require('../controller/CatalogueDownload');

// =========================
// Catalogue Download CRUD
// =========================

// Create download request
router.post('/create', CatalogueDownloadController.createDownload);

// Get all download requests
router.get('/', CatalogueDownloadController.getAllDownloads);

// Get single download request
router.get('/:id', CatalogueDownloadController.getDownloadById);

// Update download request
router.put('/:id', CatalogueDownloadController.updateDownload);

// Delete download request
router.delete('/:id', CatalogueDownloadController.deleteDownload);

// Get downloads by catalogue id
router.get(
  '/catalogue/:catalogueId',
  CatalogueDownloadController.getDownloadsByCatalogue,
);



// Get all catalogues
router.get('/catalogues/all', CatalogueDownloadController.getAllCatalogues);

// Get single catalogue
router.get('/catalogues/:id', CatalogueDownloadController.getCatalogueById);

module.exports = router;
