// middleware/multer.js
const multer = require('multer');
const path = require('path');

// ✅ memoryStorage — file stays in RAM as buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images allowed (jpeg, jpg, png, webp)'));
};

module.exports = multer({
  storage, // ← memoryStorage, no diskStorage
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
