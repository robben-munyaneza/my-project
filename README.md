# Smart Park Car Wash Management System

A full-stack web application for Smart Park, a car wash company in Rubavu, using the MERN stack (Node.js, Express.js, React with Vite, MySQL) with Sequelize for database management and Tailwind CSS for styling.

## Features

- User authentication (signup, login)
- Dashboard with system information
- Car registration and management
- Package creation and management
- Service package management with full CRUD operations
- Payment recording
- Report generation (payments by date range, services by car)

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

## Project Structure

```
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── db.js            # Database connection
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── index.html
    └── tailwind.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL server

### Database Setup
1. Create a MySQL database named `smartpark`
2. Update the database credentials in `backend/.env` file
3. (Optional) Seed the database with initial data:
   ```
   cd backend
   npm run seed
   ```
   This will create sample users, packages, cars, service packages, and payments for testing.

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Packages
- `POST /api/packages` - Create a new package
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get a single package

### Cars
- `POST /api/cars` - Register a new car
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get a single car

### Service Packages
- `POST /api/service-packages` - Create a new service package
- `GET /api/service-packages` - Get all service packages
- `GET /api/service-packages/:id` - Get a single service package
- `PUT /api/service-packages/:id` - Update a service package
- `DELETE /api/service-packages/:id` - Delete a service package

### Payments
- `POST /api/payments` - Record a new payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get a single payment

### Reports
- `GET /api/reports/payments?startDate&endDate` - Get payments by date range
- `GET /api/reports/services/:plateNumber` - Get services by car plate number

## Usage

1. Register a new user account
2. Login with your credentials (or use the seeded accounts: admin/password123 or receptionist/password123)
3. Create packages for car wash services
4. Register cars
5. Create service packages for cars
6. Record payments for service packages
7. Generate reports for payments and services

## Notes

- Delete, update, and retrieve operations are only available on the ServicePackage form. Package, Car, and Payment are create and read-only.
- The application uses JWT for authentication with tokens stored in localStorage.
- The dashboard displays summary information about cars, services, and payments.
- Reports can be generated for payments by date range and services by car plate number.
