const { Package } = require('../models');

// Create a new package
exports.create = async (req, res) => {
  try {
    const { PackageName, PackageDescription, PackagePrice } = req.body;
    
    // Validate input
    if (!PackageName || !PackagePrice) {
      return res.status(400).json({ message: 'Package name and price are required' });
    }
    
    if (PackagePrice <= 0) {
      return res.status(400).json({ message: 'Package price must be positive' });
    }
    
    // Create new package
    const newPackage = await Package.create({
      PackageName,
      PackageDescription,
      PackagePrice
    });
    
    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ message: 'Server error while creating package' });
  }
};

// Get all packages
exports.findAll = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error while fetching packages' });
  }
};

// Get a single package by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const package = await Package.findByPk(id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json(package);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Server error while fetching package' });
  }
};
