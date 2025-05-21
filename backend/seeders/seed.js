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
        Email: 'admin@smartpark.rw',
        Password: hashedPassword
      },
      {
        Username: 'receptionist',
        Email: 'receptionist@smartpark.rw',
        Password: hashedPassword
      },
      {
        Username: 'manager',
        Email: 'manager@smartpark.rw',
        Password: hashedPassword
      },
      {
        Username: 'supervisor',
        Email: 'supervisor@smartpark.rw',
        Password: hashedPassword
      }
    ]);
    console.log(`${users.length} users created`);

    // Create packages
    const packages = await Package.bulkCreate([
      {
        PackageName: 'Isuku Nguca',
        PackageDescription: 'Basic exterior wash with water and soap (Quick Wash)',
        PackagePrice: 3000
      },
      {
        PackageName: 'Isuku Isanzwe',
        PackageDescription: 'Standard exterior wash with tire shine and window cleaning (Standard Wash)',
        PackagePrice: 5000
      },
      {
        PackageName: 'Isuku Yimbere',
        PackageDescription: 'Interior vacuum, dashboard polish, and seat cleaning (Interior Clean)',
        PackagePrice: 7000
      },
      {
        PackageName: 'Isuku Yuzuye',
        PackageDescription: 'Complete interior and exterior cleaning with wax (Complete Wash)',
        PackagePrice: 10000
      },
      {
        PackageName: 'Isuku ya VIP',
        PackageDescription: 'Premium detailing with special products and engine cleaning (VIP Treatment)',
        PackagePrice: 20000
      },
      {
        PackageName: 'Isuku y\'Imodoka Nini',
        PackageDescription: 'Special package for small cars (Small Car Package)',
        PackagePrice: 4000
      },
      {
        PackageName: 'Isuku y\'Imodoka Nkuru',
        PackageDescription: 'Special package for SUVs and large vehicles (Large Vehicle Package)',
        PackagePrice: 15000
      },
      {
        PackageName: 'Isuku Vuba Vuba',
        PackageDescription: 'Express service for customers in a hurry (Express Service)',
        PackagePrice: 2500
      }
    ]);
    console.log(`${packages.length} packages created`);

    // Create cars with Rwandan license plates and common car models in Rwanda
    const cars = await Car.bulkCreate([
      {
        PlateNumber: 'RAA 123 B',
        CarType: 'Toyota Corolla',
        CarSize: 'Medium',
        DriverName: 'Jean Mugabo',
        PhoneNumber: '+250781234567'
      },
      {
        PlateNumber: 'RAB 456 C',
        CarType: 'Toyota RAV4',
        CarSize: 'SUV',
        DriverName: 'Marie Uwase',
        PhoneNumber: '+250782345678'
      },
      {
        PlateNumber: 'RAC 789 D',
        CarType: 'Toyota Land Cruiser Prado',
        CarSize: 'SUV',
        DriverName: 'Robert Mugisha',
        PhoneNumber: '+250783456789'
      },
      {
        PlateNumber: 'RAD 012 E',
        CarType: 'Mercedes Benz C200',
        CarSize: 'Large',
        DriverName: 'Emily Mutesi',
        PhoneNumber: '+250784567890'
      },
      {
        PlateNumber: 'RAE 345 F',
        CarType: 'Toyota Hilux',
        CarSize: 'Truck',
        DriverName: 'Michael Nkusi',
        PhoneNumber: '+250785678901'
      },
      {
        PlateNumber: 'RAF 678 G',
        CarType: 'Suzuki Jimny',
        CarSize: 'Small',
        DriverName: 'Alice Mukamana',
        PhoneNumber: '+250786789012'
      },
      {
        PlateNumber: 'RAG 901 H',
        CarType: 'Hyundai i10',
        CarSize: 'Small',
        DriverName: 'David Bizimana',
        PhoneNumber: '+250787890123'
      },
      {
        PlateNumber: 'RAH 234 I',
        CarType: 'Land Rover Discovery',
        CarSize: 'SUV',
        DriverName: 'Sarah Uwimana',
        PhoneNumber: '+250788901234'
      },
      {
        PlateNumber: 'RAI 567 J',
        CarType: 'Toyota Hiace',
        CarSize: 'Van',
        DriverName: 'Patrick Habimana',
        PhoneNumber: '+250789012345'
      },
      {
        PlateNumber: 'RAJ 890 K',
        CarType: 'Nissan Hardbody',
        CarSize: 'Truck',
        DriverName: 'Claudine Ingabire',
        PhoneNumber: '+250790123456'
      },
      {
        PlateNumber: 'RAK 123 L',
        CarType: 'Mitsubishi Pajero',
        CarSize: 'SUV',
        DriverName: 'Eric Ndayishimiye',
        PhoneNumber: '+250791234567'
      },
      {
        PlateNumber: 'RAL 456 M',
        CarType: 'Toyota Vitz',
        CarSize: 'Small',
        DriverName: 'Diane Umutoni',
        PhoneNumber: '+250792345678'
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
        PlateNumber: 'RAA 123 B',
        PackageNumber: 4, // Isuku Yuzuye (Complete Wash)
        UserID: 1 // admin
      },
      {
        ServiceDate: today,
        PlateNumber: 'RAF 678 G',
        PackageNumber: 8, // Isuku Vuba Vuba (Express Service)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: today,
        PlateNumber: 'RAI 567 J',
        PackageNumber: 7, // Isuku y'Imodoka Nkuru (Large Vehicle Package)
        UserID: 3 // manager
      },
      {
        ServiceDate: yesterday,
        PlateNumber: 'RAB 456 C',
        PackageNumber: 2, // Isuku Isanzwe (Standard Wash)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: yesterday,
        PlateNumber: 'RAH 234 I',
        PackageNumber: 7, // Isuku y'Imodoka Nkuru (Large Vehicle Package)
        UserID: 1 // admin
      },
      {
        ServiceDate: yesterday,
        PlateNumber: 'RAK 123 L',
        PackageNumber: 5, // Isuku ya VIP (VIP Treatment)
        UserID: 4 // supervisor
      },
      {
        ServiceDate: twoDaysAgo,
        PlateNumber: 'RAC 789 D',
        PackageNumber: 5, // Isuku ya VIP (VIP Treatment)
        UserID: 1 // admin
      },
      {
        ServiceDate: twoDaysAgo,
        PlateNumber: 'RAG 901 H',
        PackageNumber: 1, // Isuku Nguca (Quick Wash)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: twoDaysAgo,
        PlateNumber: 'RAL 456 M',
        PackageNumber: 6, // Isuku y'Imodoka Nini (Small Car Package)
        UserID: 3 // manager
      },
      {
        ServiceDate: threeDaysAgo,
        PlateNumber: 'RAD 012 E',
        PackageNumber: 1, // Isuku Nguca (Quick Wash)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: threeDaysAgo,
        PlateNumber: 'RAA 123 B',
        PackageNumber: 8, // Isuku Vuba Vuba (Express Service)
        UserID: 1 // admin
      },
      {
        ServiceDate: threeDaysAgo,
        PlateNumber: 'RAJ 890 K',
        PackageNumber: 3, // Isuku Yimbere (Interior Clean)
        UserID: 4 // supervisor
      },
      {
        ServiceDate: lastWeek,
        PlateNumber: 'RAE 345 F',
        PackageNumber: 4, // Isuku Yuzuye (Complete Wash)
        UserID: 1 // admin
      },
      {
        ServiceDate: lastWeek,
        PlateNumber: 'RAB 456 C',
        PackageNumber: 7, // Isuku y'Imodoka Nkuru (Large Vehicle Package)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: lastWeek,
        PlateNumber: 'RAI 567 J',
        PackageNumber: 3, // Isuku Yimbere (Interior Clean)
        UserID: 3 // manager
      },
      {
        ServiceDate: twoWeeksAgo,
        PlateNumber: 'RAA 123 B',
        PackageNumber: 2, // Isuku Isanzwe (Standard Wash)
        UserID: 2 // receptionist
      },
      {
        ServiceDate: twoWeeksAgo,
        PlateNumber: 'RAC 789 D',
        PackageNumber: 4, // Isuku Yuzuye (Complete Wash)
        UserID: 1 // admin
      },
      {
        ServiceDate: twoWeeksAgo,
        PlateNumber: 'RAK 123 L',
        PackageNumber: 7, // Isuku y'Imodoka Nkuru (Large Vehicle Package)
        UserID: 4 // supervisor
      },
      {
        ServiceDate: lastMonth,
        PlateNumber: 'RAD 012 E',
        PackageNumber: 5, // Isuku ya VIP (VIP Treatment)
        UserID: 1 // admin
      },
      {
        ServiceDate: lastMonth,
        PlateNumber: 'RAH 234 I',
        PackageNumber: 7, // Isuku y'Imodoka Nkuru (Large Vehicle Package)
        UserID: 2 // receptionist
      }
    ]);
    console.log(`${servicePackages.length} service packages created`);

    // Create payments (leaving some unpaid for demonstration)
    const payments = await Payment.bulkCreate([
      {
        AmountPaid: 10000,
        PaymentDate: today,
        RecordNumber: 1 // Isuku Yuzuye (Complete Wash) for RAA 123 B
      },
      {
        AmountPaid: 2500,
        PaymentDate: today,
        RecordNumber: 2 // Isuku Vuba Vuba (Express Service) for RAF 678 G
      },
      {
        AmountPaid: 15000,
        PaymentDate: today,
        RecordNumber: 3 // Isuku y'Imodoka Nkuru (Large Vehicle Package) for RAI 567 J
      },
      {
        AmountPaid: 5000,
        PaymentDate: yesterday,
        RecordNumber: 4 // Isuku Isanzwe (Standard Wash) for RAB 456 C
      },
      {
        AmountPaid: 15000,
        PaymentDate: yesterday,
        RecordNumber: 5 // Isuku y'Imodoka Nkuru (Large Vehicle Package) for RAH 234 I
      },
      {
        AmountPaid: 20000,
        PaymentDate: yesterday,
        RecordNumber: 6 // Isuku ya VIP (VIP Treatment) for RAK 123 L
      },
      {
        AmountPaid: 20000,
        PaymentDate: twoDaysAgo,
        RecordNumber: 7 // Isuku ya VIP (VIP Treatment) for RAC 789 D
      },
      {
        AmountPaid: 3000,
        PaymentDate: twoDaysAgo,
        RecordNumber: 8 // Isuku Nguca (Quick Wash) for RAG 901 H
      },
      {
        AmountPaid: 4000,
        PaymentDate: twoDaysAgo,
        RecordNumber: 9 // Isuku y'Imodoka Nini (Small Car Package) for RAL 456 M
      },
      {
        AmountPaid: 3000,
        PaymentDate: threeDaysAgo,
        RecordNumber: 10 // Isuku Nguca (Quick Wash) for RAD 012 E
      },
      {
        AmountPaid: 2500,
        PaymentDate: threeDaysAgo,
        RecordNumber: 11 // Isuku Vuba Vuba (Express Service) for RAA 123 B
      },
      {
        AmountPaid: 7000,
        PaymentDate: threeDaysAgo,
        RecordNumber: 12 // Isuku Yimbere (Interior Clean) for RAJ 890 K
      },
      {
        AmountPaid: 10000,
        PaymentDate: lastWeek,
        RecordNumber: 13 // Isuku Yuzuye (Complete Wash) for RAE 345 F
      },
      {
        AmountPaid: 15000,
        PaymentDate: lastWeek,
        RecordNumber: 14 // Isuku y'Imodoka Nkuru (Large Vehicle Package) for RAB 456 C
      },
      {
        AmountPaid: 7000,
        PaymentDate: lastWeek,
        RecordNumber: 15 // Isuku Yimbere (Interior Clean) for RAI 567 J
      },
      // Note: No payment for service packages 16, 17, 18, 19, 20 (to demonstrate unpaid services)
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
