import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import Table from '../components/Table';
import { packageService } from '../services/api';

const Package = ({ onLogout }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packageService.getAll();
        setPackages(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again.');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Form fields for package
  const packageFields = [
    {
      name: 'PackageName',
      label: 'Package Name',
      type: 'text',
      required: true,
    },
    {
      name: 'PackageDescription',
      label: 'Description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'PackagePrice',
      label: 'Price ($)',
      type: 'number',
      required: true,
      validate: (value) => {
        if (parseFloat(value) <= 0) {
          return 'Price must be greater than zero';
        }
        return null;
      }
    }
  ];

  // Table columns for packages
  const columns = [
    { key: 'PackageNumber', label: 'Package #' },
    { key: 'PackageName', label: 'Name' },
    { key: 'PackageDescription', label: 'Description' },
    {
      key: 'PackagePrice',
      label: 'Price',
      render: (row) => `$${row.PackagePrice}`
    }
  ];

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      // Create new package
      const response = await packageService.create(formData);
      setSuccess('Package created successfully');

      // Add to the list
      setPackages([...packages, response.package]);

      // Reset form
      setShowForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating package:', err);
      setError(err.response?.data?.message || 'Failed to create package');

      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Layout title="Packages" onLogout={onLogout}>
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
          {showForm ? 'Cancel' : 'Add Package'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Package</h2>
          <Form
            fields={packageFields}
            onSubmit={handleSubmit}
            submitLabel="Add Package"
          />
        </div>
      )}

      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Packages</h2>
        {loading ? (
          <p className="text-gray-500">Loading packages...</p>
        ) : packages.length === 0 ? (
          <p className="text-gray-500">No packages found.</p>
        ) : (
          <Table
            columns={columns}
            data={packages}
            actions={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default Package;
