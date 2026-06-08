const express = require('express');
const categoryRouter = express.Router();
const upload = require('../middleware/multer'); // multer
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controller/Category');

categoryRouter.post('/', upload.single('image'), createCategory);
categoryRouter.get('/all', getAllCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.put('/:id', upload.single('image'), updateCategory);
categoryRouter.delete('/:id', deleteCategory);

module.exports.categoryRouter = categoryRouter;
