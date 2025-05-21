const express = require('express');
const paymentController = require('../controllers/payment.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// POST /api/payments - Create a new payment
router.post('/', paymentController.create);

// GET /api/payments - Get all payments
router.get('/', paymentController.findAll);

// GET /api/payments/:id - Get a single payment by ID
router.get('/:id', paymentController.findOne);

module.exports = router;
