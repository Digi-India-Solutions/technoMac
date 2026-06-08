const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const {
    createCallBack,
    getAllCallBacks,
    getCallBackById,
    updateCallBackStatus,
    deleteCallBack,
    updateCallBack,
} = require('../controller/CallBack');

// ── PUBLIC (Frontend) ──────────────────────────────────────────
// POST   /api/callback        →  submit a call back request
router.post('/', createCallBack);

// ── ADMIN ──────────────────────────────────────────────────────
// GET    /api/callback        →  fetch all requests (newest first)
router.get('/', adminAuth, getAllCallBacks);

// GET    /api/callback/:id    →  fetch single request by ID
router.get('/:id', adminAuth, getCallBackById);

// PATCH  /api/callback/:id/status  →  update status (pending/contacted/closed)
router.patch('/:id/status', adminAuth, updateCallBackStatus);

// PUT    /api/callback/:id         →  update all details of a request
router.put('/:id', adminAuth, updateCallBack);

// DELETE /api/callback/:id   →  delete a request permanently
router.delete('/:id', adminAuth, deleteCallBack);

module.exports = router;
