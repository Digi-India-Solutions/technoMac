const express = require('express');
const router = express.Router();

const upload = require('../middleware/multer');
const certificateController = require('../controller/Certificate');

router.post(
  '/create',
  upload.single('image'),
  certificateController.createCertificate,
);

router.get('/all', certificateController.getAllCertificates);

router.get('/:id', certificateController.getCertificateById);

router.put(
  '/:id',
  upload.single('image'),
  certificateController.updateCertificate,
);

router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;
