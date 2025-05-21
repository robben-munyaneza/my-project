const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Car = sequelize.define('Car', {
  PlateNumber: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      notEmpty: true
    }
  },
  CarType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  CarSize: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  DriverName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  PhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^\+?[0-9]{10,15}$/ // Basic phone number validation
    }
  }
});

module.exports = Car;
