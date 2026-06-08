const express = require('express');

const {
    createSubscriber,
    getAllSubscribers,
    deleteSubscriber
} = require('../controller/Subscriber');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// POST   /api/subscribe        → subscribe a new user
router.post('/', createSubscriber);

// GET    /api/subscribe        → get all subscribers (admin panel)
router.get('/',adminAuth, getAllSubscribers);

// DELETE /api/subscribe/:id    
router.delete('/:id',adminAuth, deleteSubscriber);

module.exports = router;