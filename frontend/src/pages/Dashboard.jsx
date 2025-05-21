import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Table from '../components/Table';
import { servicePackageService, carService, paymentService } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalCars: 0,
    recentServices: 0,
    monthlyPayments: 0
  });
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch cars count
        const cars = await carService.getAll();

        // Fetch recent services
        const services = await servicePackageService.getAll();

        // Fetch payments
        const payments = await paymentService.getAll();

        // Calculate stats
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Services this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const servicesThisWeek = services.filter(service =>
          new Date(service.ServiceDate) >= oneWeekAgo
        );

        // Payments this month
        const paymentsThisMonth = payments.filter(payment =>
          new Date(payment.PaymentDate) >= firstDayOfMonth
        );

        const totalMonthlyPayments = paymentsThisMonth.reduce(
          (sum, payment) => sum + Number(payment.AmountPaid),
          0
        );

        // Set stats
        setStats({
          totalCars: cars.length,
          recentServices: servicesThisWeek.length,
          monthlyPayments: totalMonthlyPayments.toFixed(2)
        });

        // Set recent services (last 5)
        const sortedServices = [...services].sort((a, b) =>
          new Date(b.ServiceDate) - new Date(a.ServiceDate)
        ).slice(0, 5);

        setRecentServices(sortedServices);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Table columns for recent services
  const serviceColumns = [
    { key: 'RecordNumber', label: 'Record #' },
    {
      key: 'ServiceDate',
      label: 'Date',
      render: (row) => new Date(row.ServiceDate).toLocaleDateString()
    },
    { key: 'PlateNumber', label: 'Plate Number' },
    {
      key: 'Package',
      label: 'Package',
      render: (row) => row.Package?.PackageName || 'N/A'

    },

    {
      key: 'Price',
      label: 'Price',
      render: (row) => `$${row.Package?.PackagePrice || 0}`
    }
  ];

  return (
    <Layout title="Dashboard" onLogout={onLogout}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card
              title="Total Cars"
              value={stats.totalCars}
              icon="fas fa-car"
              color="primary"
            />
            <Card
              title="Services This Week"
              value={stats.recentServices}
              icon="fas fa-box-open"
              color="blue"
            />
            <Card
              title="Payments This Month"
              value={`RWF ${stats.monthlyPayments}`}
              icon="fas fa-money-bill-wave"
              color="green"
            />
          </div>

          {/* Recent Services */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Services</h2>
            <Table
              columns={serviceColumns}
              data={recentServices}
              actions={false}
            />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
