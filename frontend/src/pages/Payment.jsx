import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import Table from '../components/Table';
import { paymentService, servicePackageService } from '../services/api';

const Payment = ({ onLogout }) => {
  const [payments, setPayments] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch payments
        const paymentsData = await paymentService.getAll();
        setPayments(paymentsData);

        // Fetch service packages for dropdown
        const servicePackagesData = await servicePackageService.getAll();

        // Filter out service packages that already have payments
        const paidRecordNumbers = paymentsData.map(payment => payment.RecordNumber);
        const unpaidServicePackages = servicePackagesData.filter(
          sp => !paidRecordNumbers.includes(sp.RecordNumber)
        );

        setServicePackages(unpaidServicePackages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form fields for payment
  const paymentFields = [
    {
      name: 'RecordNumber',
      label: 'Service Package',
      type: 'select',
      required: true,
      options: servicePackages.map(sp => ({
        value: sp.RecordNumber,
        label: `#${sp.RecordNumber} - ${sp.Car?.PlateNumber || 'N/A'} - ${sp.Package?.PackageName || 'N/A'} ($${sp.Package?.PackagePrice || 0})`
      }))
    },
    {
      name: 'AmountPaid',
      label: 'Amount Paid ($)',
      type: 'number',
      required: true,
      validate: (value) => {
        if (parseFloat(value) <= 0) {
          return 'Amount must be greater than zero';
        }
        return null;
      }
    },
    {
      name: 'PaymentDate',
      label: 'Payment Date',
      type: 'date',
      required: true,
    }
  ];

  // Table columns for payments
  const columns = [
    { key: 'PaymentNumber', label: 'Payment #' },
    {
      key: 'PaymentDate',
      label: 'Date',
      render: (row) => new Date(row.PaymentDate).toLocaleDateString()
    },
    {
      key: 'RecordNumber',
      label: 'Service Record #',
      render: (row) => `#${row.RecordNumber}`
    },
    {
      key: 'ServicePackage',
      label: 'Service Details',
      render: (row) => {
        const sp = row.ServicePackage;
        if (!sp) return 'N/A';
        return `${sp.Car?.PlateNumber || 'N/A'} - ${sp.Package?.PackageName || 'N/A'}`;
      }
    },
    {
      key: 'AmountPaid',
      label: 'Amount Paid',
      render: (row) => `$${row.AmountPaid}`
    }
  ];

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      // Create new payment
      const response = await paymentService.create(formData);
      setSuccess('Payment recorded successfully');

      // Add to the list
      setPayments([...payments, response.payment]);

      // Remove the service package from the dropdown options
      setServicePackages(servicePackages.filter(
        sp => sp.RecordNumber !== parseInt(formData.RecordNumber)
      ));

      // Reset form
      setShowForm(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(err.response?.data?.message || 'Failed to record payment');

      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Layout title="Payments" onLogout={onLogout}>
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
          disabled={servicePackages.length === 0}
        >
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
        {servicePackages.length === 0 && !showForm && (
          <p className="text-gray-500 mt-2">
            No unpaid service packages available. Create a service package first.
          </p>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Record Payment</h2>
          <Form
            fields={paymentFields}
            onSubmit={handleSubmit}
            initialValues={{
              PaymentDate: new Date().toISOString().split('T')[0]
            }}
            submitLabel="Record Payment"
          />
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
        {loading ? (
          <p className="text-gray-500">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">No payments found.</p>
        ) : (
          <Table
            columns={columns}
            data={payments}
            actions={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default Payment;
