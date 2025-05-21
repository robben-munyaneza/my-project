const bcrypt = require('bcrypt');
const { User, Package, Car, ServicePackage, Payment } = require('../models');
const sequelize = require('../db');

// Function to seed the database with initial data
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.bulkCreate([
      {
        Username: 'admin',
        Email: 'admin@smartpark.com',
        Password: hashedPassword
      },
      {
        Username: 'receptionist',
        Email: 'receptionist@smartpark.com',
        Password: hashedPassword
      }
    ]);
    console.log(`${users.length} users created`);

    // Create packages
    const packages = await Package.bulkCreate([
      {
        PackageName: 'Basic Wash',
        PackageDescription: 'Exterior wash with basic cleaning and tire shine',
        PackagePrice: 5000
      },
      {
        PackageName: 'Standard Wash',
        PackageDescription: 'Exterior wash with interior vacuum and dashboard polish',
        PackagePrice: 8000
      },
      {
        PackageName: 'Premium Wash',
        PackageDescription: 'Full exterior and interior cleaning with wax and seat treatment',
        PackagePrice: 12000
      },
      {
        PackageName: 'Deluxe Detail',
        PackageDescription: 'Complete detailing with premium products, engine cleaning, and undercarriage wash',
        PackagePrice: 20000
      },
      {
        PackageName: 'Express Wash',
        PackageDescription: 'Quick exterior wash for customers in a hurry',
        PackagePrice: 3000
      },
      {
        PackageName: 'SUV Special',
        PackageDescription: 'Specialized cleaning package for larger vehicles',
        PackagePrice: 15000
      }
    ]);
    console.log(`${packages.length} packages created`);

    // Create cars
    const cars = await Car.bulkCreate([
      {
        PlateNumber: 'RAA123B',
        CarType: 'Toyota Corolla',
        CarSize: 'Medium',
        DriverName: 'Jean Mugabo',
        PhoneNumber: '+250781234567'
      },
      {
        PlateNumber: 'RAB456C',
        CarType: 'Honda Civic',
        CarSize: 'Medium',
        DriverName: 'Marie Uwase',
        PhoneNumber: '+250782345678'
      },
      {
        PlateNumber: 'RAC789D',
        CarType: 'Ford Explorer',
        CarSize: 'SUV',
        DriverName: 'Robert Mugisha',
        PhoneNumber: '+250783456789'
      },
      {
        PlateNumber: 'RAD012E',
        CarType: 'Mercedes Benz',
        CarSize: 'Large',
        DriverName: 'Emily Mutesi',
        PhoneNumber: '+250784567890'
      },
      {
        PlateNumber: 'RAE345F',
        CarType: 'Toyota Hilux',
        CarSize: 'Truck',
        DriverName: 'Michael Nkusi',
        PhoneNumber: '+250785678901'
      },
      {
        PlateNumber: 'RAF678G',
        CarType: 'Nissan Patrol',
        CarSize: 'SUV',
        DriverName: 'Alice Mukamana',
        PhoneNumber: '+250786789012'
      },
      {
        PlateNumber: 'RAG901H',
        CarType: 'Hyundai i10',
        CarSize: 'Small',
        DriverName: 'David Bizimana',
        PhoneNumber: '+250787890123'
      },
      {
        PlateNumber: 'RAH234I',
        CarType: 'Land Rover',
        CarSize: 'SUV',
        DriverName: 'Sarah Uwimana',
        PhoneNumber: '+250788901234'
      }
    ]);
    console.log(`${cars.length} cars created`);

    // Create service packages with more realistic dates
    const today = new Date();

    // Create dates for different time periods
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Create service packages with a variety of dates and cars
    const servicePackages = await ServicePackage.bulkCreate([
      {
        ServiceDate: today,
        PlateNumber: 'RAA123B',
        PackageNumber: 3, // Premium Wash
        UserID: 1 // admin
      },
      {
        ServiceDate: today,
        PlateNumber: 'RAF678G',
        PackageNumber: 5, // Express Wash
        UserID: 2 // receptionist
      },
      {
        ServiceDate: yesterday,
        PlateNumber: 'RAB456C',
        PackageNumber: 2, // Standard Wash
        UserID: 2 // receptionist
      },
      {
        ServiceDate: yesterday,
        PlateNumber: 'RAH234I',
        PackageNumber: 6, // SUV Special
        UserID: 1 // admin
      },
      {
        ServiceDate: twoDaysAgo,
        PlateNumber: 'RAC789D',
        PackageNumber: 4, // Deluxe Detail
        UserID: 1 // admin
      },
      {
        ServiceDate: twoDaysAgo,
        PlateNumber: 'RAG901H',
        PackageNumber: 1, // Basic Wash
        UserID: 2 // receptionist
      },
      {
        ServiceDate: threeDaysAgo,
        PlateNumber: 'RAD012E',
        PackageNumber: 1, // Basic Wash
        UserID: 2 // receptionist
      },
      {
        ServiceDate: threeDaysAgo,
        PlateNumber: 'RAA123B',
        PackageNumber: 5, // Express Wash
        UserID: 1 // admin
      },
      {
        ServiceDate: lastWeek,
        PlateNumber: 'RAE345F',
        PackageNumber: 3, // Premium Wash
        UserID: 1 // admin
      },
      {
        ServiceDate: lastWeek,
        PlateNumber: 'RAB456C',
        PackageNumber: 6, // SUV Special
        UserID: 2 // receptionist
      },
      {
        ServiceDate: twoWeeksAgo,
        PlateNumber: 'RAA123B',
        PackageNumber: 2, // Standard Wash
        UserID: 2 // receptionist
      },
      {
        ServiceDate: twoWeeksAgo,
        PlateNumber: 'RAC789D',
        PackageNumber: 3, // Premium Wash
        UserID: 1 // admin
      },
      {
        ServiceDate: lastMonth,
        PlateNumber: 'RAD012E',
        PackageNumber: 4, // Deluxe Detail
        UserID: 1 // admin
      },
      {
        ServiceDate: lastMonth,
        PlateNumber: 'RAH234I',
        PackageNumber: 6, // SUV Special
        UserID: 2 // receptionist
      }
    ]);
    console.log(`${servicePackages.length} service packages created`);

    // Create payments (leaving some unpaid for demonstration)
    const payments = await Payment.bulkCreate([
      {
        AmountPaid: 12000,
        PaymentDate: today,
        RecordNumber: 1 // Premium Wash for RAA123B
      },
      {
        AmountPaid: 3000,
        PaymentDate: today,
        RecordNumber: 2 // Express Wash for RAF678G
      },
      {
        AmountPaid: 8000,
        PaymentDate: yesterday,
        RecordNumber: 3 // Standard Wash for RAB456C
      },
      {
        AmountPaid: 15000,
        PaymentDate: yesterday,
        RecordNumber: 4 // SUV Special for RAH234I
      },
      {
        AmountPaid: 20000,
        PaymentDate: twoDaysAgo,
        RecordNumber: 5 // Deluxe Detail for RAC789D
      },
      {
        AmountPaid: 5000,
        PaymentDate: twoDaysAgo,
        RecordNumber: 6 // Basic Wash for RAG901H
      },
      {
        AmountPaid: 5000,
        PaymentDate: threeDaysAgo,
        RecordNumber: 7 // Basic Wash for RAD012E
      },
      {
        AmountPaid: 3000,
        PaymentDate: threeDaysAgo,
        RecordNumber: 8 // Express Wash for RAA123B
      },
      {
        AmountPaid: 12000,
        PaymentDate: lastWeek,
        RecordNumber: 9 // Premium Wash for RAE345F
      },
      {
        AmountPaid: 15000,
        PaymentDate: lastWeek,
        RecordNumber: 10 // SUV Special for RAB456C
      },
      // Note: No payment for service packages 11, 12, 13, 14 (to demonstrate unpaid services)
    ]);
    console.log(`${payments.length} payments created`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the seed function
seedDatabase();
