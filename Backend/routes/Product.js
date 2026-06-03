const express = require('express');
const productRouter = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubCategory,
  getFeaturedProducts,
  updateProduct,
  deleteProduct,
} = require('../controller/Product');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');

productRouter.post('/', adminAuth, upload.array('images', 10), createProduct); // max 10 images
productRouter.get('/', getAllProducts);
productRouter.get('/featured', getFeaturedProducts);
productRouter.get('/by-category/:categoryId', getProductsByCategory);
productRouter.get('/by-subcategory/:subCategoryId', getProductsBySubCategory);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', adminAuth, upload.array('images', 10), updateProduct);
productRouter.delete('/:id', deleteProduct);

module.exports.productRouter = productRouter;
