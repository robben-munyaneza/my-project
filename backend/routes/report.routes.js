const express = require('express');
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// GET /api/reports/payments - Get payments by date range
router.get('/payments', reportController.getPaymentsByDateRange);

// GET /api/reports/services/:plateNumber - Get services by car plate number
router.get('/services/:plateNumber', reportController.getServicesByPlateNumber);

module.exports = router;
