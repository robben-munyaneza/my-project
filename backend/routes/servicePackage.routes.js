const express = require('express');
const servicePackageController = require('../controllers/servicePackage.controller');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// POST /api/service-packages - Create a new service package
router.post('/', servicePackageController.create);

// GET /api/service-packages - Get all service packages
router.get('/', servicePackageController.findAll);

// GET /api/service-packages/:id - Get a single service package by ID
router.get('/:id', servicePackageController.findOne);

// PUT /api/service-packages/:id - Update a service package
router.put('/:id', servicePackageController.update);

// DELETE /api/service-packages/:id - Delete a service package
router.delete('/:id', servicePackageController.delete);

module.exports = router;
