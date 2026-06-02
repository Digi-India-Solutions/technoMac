const express = require('express');
const subCategoryRouter = express.Router();
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} = require('../controller/Subcategory');
// ✅ Ye line add karo file ke top mein
const upload = require('../middleware/multer');

subCategoryRouter.post('/', upload.single('image'), createSubCategory);
subCategoryRouter.get('/', getAllSubCategories);
subCategoryRouter.get('/by-category/:categoryId', getSubCategoriesByCategory); // ← important
subCategoryRouter.get('/:id', getSubCategoryById);
subCategoryRouter.put('/:id', upload.single('image'), updateSubCategory);
subCategoryRouter.delete('/:id', deleteSubCategory);

module.exports.subCategoryRouter = subCategoryRouter;
