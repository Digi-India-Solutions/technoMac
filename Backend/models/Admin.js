const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Admin',
  },

  // ── Email Verification ──
  isVerified: {
    type: Boolean,
    default: false, // register ke baad false rahega jab tak OTP verify na ho
  },
  otp: String, // hashed OTP store hoga
  otpExpires: Date, // OTP expiry time

  // ── Forgot Password ──
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

exports.Admin = mongoose.model('Admin', AdminSchema);
