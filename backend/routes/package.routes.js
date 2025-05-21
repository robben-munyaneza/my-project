const express = require('express');
const packageController = require('../controllers/package.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// POST /api/packages - Create a new package
router.post('/', packageController.create);

// GET /api/packages - Get all packages
router.get('/', packageController.findAll);

// GET /api/packages/:id - Get a single package by ID
router.get('/:id', packageController.findOne);

module.exports = router;
