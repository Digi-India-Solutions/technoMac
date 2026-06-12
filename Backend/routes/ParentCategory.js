const express = require('express');
const parentCategoryRouter = express.Router();
const upload = require('../middleware/multer'); // multer
const {
    createParentCategory,
    getAllParentCategory,
    getParentCategoryById,
    updateParentCategory,
    deleteParentCategory,
} = require('../controller/ParentCategory');

parentCategoryRouter.post('/create', upload.single('image'), createParentCategory);
parentCategoryRouter.get('/all', getAllParentCategory);
parentCategoryRouter.get('/:id', getParentCategoryById);
parentCategoryRouter.put('/:id', upload.single('image'), updateParentCategory);
parentCategoryRouter.delete('/:id', deleteParentCategory);

module.exports.parentCategoryRouter = parentCategoryRouter;
