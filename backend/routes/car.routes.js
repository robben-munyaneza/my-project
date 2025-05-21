const express = require('express');
const carController = require('../controllers/car.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// POST /api/cars - Create a new car
router.post('/', carController.create);

// GET /api/cars - Get all cars
router.get('/', carController.findAll);

// GET /api/cars/:id - Get a single car by plate number
router.get('/:id', carController.findOne);

module.exports = router;
