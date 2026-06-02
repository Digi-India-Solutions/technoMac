const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  resendOTP,
  loginAdmin,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controller/Admin');

router.post('/register', registerAdmin);
router.get('/verify-email/:token', verifyEmail);  // GET — link click hoga browser se
router.post('/resend-otp', resendOTP);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
