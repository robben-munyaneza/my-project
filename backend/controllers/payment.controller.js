const { Payment, ServicePackage, Package } = require('../models');

// Create a new payment
exports.create = async (req, res) => {
  try {
    const { AmountPaid, PaymentDate, RecordNumber } = req.body;
    
    // Validate input
    if (!AmountPaid || !RecordNumber) {
      return res.status(400).json({ message: 'Amount paid and record number are required' });
    }
    
    if (AmountPaid <= 0) {
      return res.status(400).json({ message: 'Amount paid must be positive' });
    }
    
    // Check if service package exists
    const servicePackage = await ServicePackage.findByPk(RecordNumber, {
      include: [{ model: Package }]
    });
    
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Check if payment for this service package already exists
    const existingPayment = await Payment.findOne({ where: { RecordNumber } });
    
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment for this service package already exists' });
    }
    
    // Create new payment
    const newPayment = await Payment.create({
      AmountPaid,
      PaymentDate: PaymentDate || new Date(),
      RecordNumber
    });
    
    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: newPayment
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ message: 'Server error while recording payment' });
  }
};

// Get all payments
exports.findAll = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{
        model: ServicePackage,
        include: [{ model: Package }]
      }]
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments' });
  }
};

// Get a single payment by ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findByPk(id, {
      include: [{
        model: ServicePackage,
        include: [{ model: Package }]
      }]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error while fetching payment' });
  }
};
