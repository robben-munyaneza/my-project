const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ServicePackage = sequelize.define('ServicePackage', {
  RecordNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ServiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  PlateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Cars',
      key: 'PlateNumber'
    }
  },
  PackageNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Packages',
      key: 'PackageNumber'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'UserID'
    }
  }
});

module.exports = ServicePackage;
