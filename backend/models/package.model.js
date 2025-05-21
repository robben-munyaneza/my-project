const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Package = sequelize.define('Package', {
  PackageNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PackageName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  PackageDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  PackagePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0 // Price must be positive
    }
  }
});

module.exports = Package;
