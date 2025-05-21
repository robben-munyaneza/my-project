import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import Table from '../components/Table';
import { servicePackageService, packageService, carService } from '../services/api';

const ServicePackage = ({ onLogout }) => {
  const [servicePackages, setServicePackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentServicePackage, setCurrentServicePackage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch service packages
        const servicePackagesData = await servicePackageService.getAll();
        setServicePackages(servicePackagesData);

        // Fetch packages for dropdown
        const packagesData = await packageService.getAll();
        setPackages(packagesData);

        // Fetch cars for dropdown
        const carsData = await carService.getAll();
        setCars(carsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form fields for service package
  const servicePackageFields = [
    {
      name: 'ServiceDate',
      label: 'Service Date',
      type: 'date',
      required: true,
    },
    {
      name: 'PlateNumber',
      label: 'Car',
      type: 'select',
      required: true,
      options: cars.map(car => ({
        value: car.PlateNumber,
        label: `${car.PlateNumber} - ${car.CarType} (${car.DriverName})`
      }))
    },
    {
      name: 'PackageNumber',
      label: 'Package',
      type: 'select',
      required: true,
      options: packages.map(pkg => ({
        value: pkg.PackageNumber,
        label: `${pkg.PackageName} - $${pkg.PackagePrice}`
      }))
    }
  ];

  // Table columns for service packages
  const columns = [
    { key: 'RecordNumber', label: 'Record #' },
    {
      key: 'ServiceDate',
      label: 'Date',
      render: (row) => new Date(row.ServiceDate).toLocaleDateString()
    },
    { key: 'PlateNumber', label: 'Plate Number' },
    {
      key: 'Car',
      label: 'Car Details',
      render: (row) => row.Car ? `${row.Car.CarType} - ${row.Car.DriverName}` : 'N/A'
    },
    {
      key: 'Package',
      label: 'Package',
      render: (row) => row.Package ? row.Package.PackageName : 'N/A'
    },
    {
      key: 'Price',
      label: 'Price',
      render: (row) => row.Package ? `$${row.Package.PackagePrice}` : 'N/A'
    }
  ];

  // Handle form submission for create/update
  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        // Update existing service package
        await servicePackageService.update(currentServicePackage.RecordNumber, formData);
        setSuccess('Service package updated successfully');

        // Update the list
        const updatedServicePackages = servicePackages.map(sp =>
          sp.RecordNumber === currentServicePackage.RecordNumber
            ? { ...sp, ...formData }
            : sp
        );
        setServicePackages(updatedServicePackages);
      } else {
        // Create new service package
        const response = await servicePackageService.create(formData);
        setSuccess('Service package created successfully');

        // Add to the list
        setServicePackages([...servicePackages, response.servicePackage]);
      }

      // Reset form
      setShowForm(false);
      setIsEditing(false);
      setCurrentServicePackage(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving service package:', err);
      setError(err.response?.data?.message || 'Failed to save service package');

      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle edit button click
  const handleEdit = (servicePackage) => {
    setCurrentServicePackage(servicePackage);
    setIsEditing(true);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (servicePackage) => {
    if (window.confirm(`Are you sure you want to delete service package #${servicePackage.RecordNumber}?`)) {
      try {
        await servicePackageService.delete(servicePackage.RecordNumber);
        setSuccess('Service package deleted successfully');

        // Remove from the list
        setServicePackages(servicePackages.filter(sp =>
          sp.RecordNumber !== servicePackage.RecordNumber
        ));

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting service package:', err);
        setError(err.response?.data?.message || 'Failed to delete service package');

        // Clear error message after 3 seconds
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <Layout title="Service Packages" onLogout={onLogout}>
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
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setIsEditing(false);
              setCurrentServicePackage(null);
            }
          }}
          className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md"
        >
          {showForm ? 'Cancel' : (isEditing ? 'Cancel Edit' : 'Add Service Package')}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Service Package' : 'Add Service Package'}
          </h2>
          <Form
            fields={servicePackageFields}
            onSubmit={handleSubmit}
            initialValues={isEditing ? {
              ServiceDate: currentServicePackage.ServiceDate ? new Date(currentServicePackage.ServiceDate).toISOString().split('T')[0] : '',
              PlateNumber: currentServicePackage.PlateNumber,
              PackageNumber: currentServicePackage.PackageNumber
            } : {}}
            submitLabel={isEditing ? 'Update Service Package' : 'Add Service Package'}
          />
        </div>
      )}

      {/* Service Packages Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Service Packages</h2>
        {loading ? (
          <p className="text-gray-500">Loading service packages...</p>
        ) : servicePackages.length === 0 ? (
          <p className="text-gray-500">No service packages found.</p>
        ) : (
          <Table
            columns={columns}
            data={servicePackages}
            actions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default ServicePackage;
