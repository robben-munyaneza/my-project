const { Car } = require('../models');

// Create a new car
exports.create = async (req, res) => {
  try {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    
    // Validate input
    if (!PlateNumber || !CarType || !CarSize || !DriverName || !PhoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if car with plate number already exists
    const existingCar = await Car.findByPk(PlateNumber);
    
    if (existingCar) {
      return res.status(400).json({ message: 'Car with this plate number already exists' });
    }
    
    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(PhoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    // Create new car
    const newCar = await Car.create({
      PlateNumber,
      CarType,
      CarSize,
      DriverName,
      PhoneNumber
    });
    
    res.status(201).json({
      message: 'Car registered successfully',
      car: newCar
    });
  } catch (error) {
    console.error('Error registering car:', error);
    res.status(500).json({ message: 'Server error while registering car' });
  }
};

// Get all cars
exports.findAll = async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error while fetching cars' });
  }
};

// Get a single car by plate number
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error while fetching car' });
  }
};
