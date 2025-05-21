const User = require('./user.model');
const Package = require('./package.model');
const Car = require('./car.model');
const ServicePackage = require('./servicePackage.model');
const Payment = require('./payment.model');

// Define relationships
User.hasMany(ServicePackage, { foreignKey: 'UserID' });
ServicePackage.belongsTo(User, { foreignKey: 'UserID' });

Package.hasMany(ServicePackage, { foreignKey: 'PackageNumber' });
ServicePackage.belongsTo(Package, { foreignKey: 'PackageNumber' });

Car.hasMany(ServicePackage, { foreignKey: 'PlateNumber' });
ServicePackage.belongsTo(Car, { foreignKey: 'PlateNumber' });

ServicePackage.hasOne(Payment, { foreignKey: 'RecordNumber' });
Payment.belongsTo(ServicePackage, { foreignKey: 'RecordNumber' });

module.exports = {
  User,
  Package,
  Car,
  ServicePackage,
  Payment
};
