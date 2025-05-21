const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const packageRoutes = require('./routes/package.routes');
const carRoutes = require('./routes/car.routes');
const servicePackageRoutes = require('./routes/servicePackage.routes');
const paymentRoutes = require('./routes/payment.routes');
const reportRoutes = require('./routes/report.routes');

// Import models
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/service-packages', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Smart Park API is running');
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
