const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payment = sequelize.define('Payment', {
  PaymentNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  AmountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0 // Amount must be positive
    }
  },
  PaymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  RecordNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'ServicePackages',
      key: 'RecordNumber'
    }
  }
});

module.exports = Payment;
