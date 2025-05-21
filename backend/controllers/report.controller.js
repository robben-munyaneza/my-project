const { Payment, ServicePackage, Car, Package } = require('../models');
const { Op } = require('sequelize');

// Get payments by date range
exports.getPaymentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    const payments = await Payment.findAll({
      where: {
        PaymentDate: {
          [Op.between]: [start, end]
        }
      },
      include: [{
        model: ServicePackage,
        include: [
          { model: Package },
          { model: Car }
        ]
      }]
    });
    
    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.AmountPaid), 0);
    
    res.status(200).json({
      payments,
      totalAmount,
      count: payments.length,
      startDate: start,
      endDate: end
    });
  } catch (error) {
    console.error('Error generating payment report:', error);
    res.status(500).json({ message: 'Server error while generating payment report' });
  }
};

// Get services by car plate number
exports.getServicesByPlateNumber = async (req, res) => {
  try {
    const { plateNumber } = req.params;
    
    if (!plateNumber) {
      return res.status(400).json({ message: 'Plate number is required' });
    }
    
    // Check if car exists
    const car = await Car.findByPk(plateNumber);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    const services = await ServicePackage.findAll({
      where: { PlateNumber: plateNumber },
      include: [
        { model: Package },
        { 
          model: Payment,
          required: false // Left join to include services without payments
        }
      ]
    });
    
    res.status(200).json({
      car,
      services,
      count: services.length
    });
  } catch (error) {
    console.error('Error generating service report:', error);
    res.status(500).json({ message: 'Server error while generating service report' });
  }
};
