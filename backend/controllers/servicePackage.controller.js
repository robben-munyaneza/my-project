const { ServicePackage, Car, Package, User } = require('../models');

// Create a new service package
exports.create = async (req, res) => {
  try {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    const UserID = req.userId; // From auth middleware
    
    // Validate input
    if (!ServiceDate || !PlateNumber || !PackageNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if car exists
    const car = await Car.findByPk(PlateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if package exists
    const packageItem = await Package.findByPk(PackageNumber);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Create new service package
    const newServicePackage = await ServicePackage.create({
      ServiceDate,
      PlateNumber,
      PackageNumber,
      UserID
    });
    
    res.status(201).json({
      message: 'Service package created successfully',
      servicePackage: newServicePackage
    });
  } catch (error) {
    console.error('Error creating service package:', error);
    res.status(500).json({ message: 'Server error while creating service package' });
  }
};

// Get all service packages
exports.findAll = async (req, res) => {
  try {
    const servicePackages = await ServicePackage.findAll({
      include: [
        { model: Car },
        { model: Package },
        { model: User, attributes: ['Username'] }
      ]
    });
    res.status(200).json(servicePackages);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    res.status(500).json({ message: 'Server error while fetching service packages' });
  }
};

// Get a single service package by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const servicePackage = await ServicePackage.findByPk(id, {
      include: [
        { model: Car },
        { model: Package },
        { model: User, attributes: ['Username'] }
      ]
    });
    
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    res.status(200).json(servicePackage);
  } catch (error) {
    console.error('Error fetching service package:', error);
    res.status(500).json({ message: 'Server error while fetching service package' });
  }
};

// Update a service package
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;
    
    // Validate input
    if (!ServiceDate || !PlateNumber || !PackageNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if service package exists
    const servicePackage = await ServicePackage.findByPk(id);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Check if car exists
    const car = await Car.findByPk(PlateNumber);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    // Check if package exists
    const packageItem = await Package.findByPk(PackageNumber);
    if (!packageItem) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Update service package
    await servicePackage.update({
      ServiceDate,
      PlateNumber,
      PackageNumber
    });
    
    res.status(200).json({
      message: 'Service package updated successfully',
      servicePackage
    });
  } catch (error) {
    console.error('Error updating service package:', error);
    res.status(500).json({ message: 'Server error while updating service package' });
  }
};

// Delete a service package
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service package exists
    const servicePackage = await ServicePackage.findByPk(id);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Delete service package
    await servicePackage.destroy();
    
    res.status(200).json({
      message: 'Service package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service package:', error);
    res.status(500).json({ message: 'Server error while deleting service package' });
  }
};
