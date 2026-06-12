const express = require('express');
const subCategoryRouter = express.Router();
const upload = require('../middleware/multer');

const {
  createSubCategory,
  getAllSubCategories,
  getAllActiveSubCategories,
  getSubCategoryById,
  getSubCategoriesByCategory,
  getSubCategoriesByParent,
  updateSubCategory,
  deleteSubCategory,
} = require('../controller/Subcategory');

subCategoryRouter.post('/', upload.single('image'), createSubCategory);
subCategoryRouter.get('/',  getAllSubCategories);        // admin (all)
subCategoryRouter.get('/active', getAllActiveSubCategories);             // public
subCategoryRouter.get('/by-category/:categoryId', getSubCategoriesByCategory);           // filter by category
subCategoryRouter.get('/by-parent/:parentId', getSubCategoriesByParent);             // filter by parentCategory
subCategoryRouter.get('/:id', getSubCategoryById);
subCategoryRouter.put('/:id',  upload.single('image'), updateSubCategory);
subCategoryRouter.delete('/:id',  deleteSubCategory);

module.exports.subCategoryRouter = subCategoryRouter;