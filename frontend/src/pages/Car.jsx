import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import Table from '../components/Table';
import { carService } from '../services/api';

const Car = ({ onLogout }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch cars on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await carService.getAll();
        setCars(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again.');
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Form fields for car
  const carFields = [
    {
      name: 'PlateNumber',
      label: 'Plate Number',
      type: 'text',
      required: true,
    },
    {
      name: 'CarType',
      label: 'Car Type',
      type: 'text',
      required: true,
    },
    {
      name: 'CarSize',
      label: 'Car Size',
      type: 'select',
      required: true,
      options: [
        { value: 'Small', label: 'Small' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Large', label: 'Large' },
        { value: 'SUV', label: 'SUV' },
        { value: 'Van', label: 'Van' },
        { value: 'Truck', label: 'Truck' }
      ]
    },
    {
      name: 'DriverName',
      label: 'Driver Name',
      type: 'text',
      required: true,
    },
    {
      name: 'PhoneNumber',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      validate: (value) => {
        // Basic phone number validation
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(value)) {
          return 'Invalid phone number format (e.g. +250XXXXXXXXX)';
        }
        return null;
      }
    }
  ];

  // Table columns for cars
  const columns = [
    { key: 'PlateNumber', label: 'Plate Number' },
    { key: 'CarType', label: 'Car Type' },
    { key: 'CarSize', label: 'Size' },
    { key: 'DriverName', label: 'Driver Name' },
    { key: 'PhoneNumber', label: 'Phone Number' }
  ];

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      // Create new car
      const response = await carService.create(formData);
      setSuccess('Car registered successfully');

      // Add to the list
      setCars([...cars, response.car]);

      // Reset form
      setShowForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error registering car:', err);
      if (err.response?.data?.message?.includes('plate number already exists')) {
        setError('A car with this plate number already exists');
      } else {
        setError(err.response?.data?.message || 'Failed to register car');
      }

      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Layout title="Cars" onLogout={onLogout}>
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Toggle Form Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md"
        >
          {showForm ? 'Cancel' : 'Register Car'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Register Car</h2>
          <Form
            fields={carFields}
            onSubmit={handleSubmit}
            submitLabel="Register Car"
          />
        </div>
      )}

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Registered Cars</h2>
        {loading ? (
          <p className="text-gray-500">Loading cars...</p>
        ) : cars.length === 0 ? (
          <p className="text-gray-500">No cars found.</p>
        ) : (
          <Table
            columns={columns}
            data={cars}
            actions={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default Car;
