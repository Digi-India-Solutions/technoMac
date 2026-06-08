const express = require('express');
const router = express.Router();

const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multer');

const {
    createClient,
    getAllClients,
    getAllClientsAdmin,
    getClientById,
    updateClient,
    deleteClient,
    toggleClientStatus,
} = require('../controller/Client');

// ── PUBLIC (Frontend) ──────────────────────────────────────────
// GET /api/client/all  →  fetch all active clients (sorted by order)
router.get('/all', getAllClients);

// ── ADMIN ──────────────────────────────────────────────────────
// GET    /api/client/admin/all          →  fetch ALL clients (incl. inactive)
router.get('/admin/all',  getAllClientsAdmin);

// GET    /api/client/:id                →  fetch single client by ID
router.get('/:id',  getClientById);

// POST   /api/client/create             →  add a new client (with image upload)
router.post('/create',  upload.single('image'), createClient);

// PUT    /api/client/update/:id         →  update client details / image
router.put('/update/:id',  upload.single('image'), updateClient);

// PATCH  /api/client/toggle/:id         →  toggle isActive (show/hide)
router.patch('/toggle/:id',  toggleClientStatus);

// DELETE /api/client/delete/:id         →  permanently delete a client
router.delete('/delete/:id',  deleteClient);

module.exports = router;
