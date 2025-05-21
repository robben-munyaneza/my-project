import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import { reportService, carService } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = ({ onLogout }) => {
  const [cars, setCars] = useState([]);
  const [paymentReport, setPaymentReport] = useState(null);
  const [serviceReport, setServiceReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlateNumber, setSelectedPlateNumber] = useState('');

  // Fetch cars for dropdown on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAll();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars for dropdown');
      }
    };

    fetchCars();

    // Set default dates (current month)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    setStartDate(firstDayOfMonth);
    setEndDate(lastDayOfMonth);
  }, []);

  // Generate payment report
  const generatePaymentReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPaymentReport(null);

      const report = await reportService.getPaymentsByDateRange(startDate, endDate);
      setPaymentReport(report);
      setLoading(false);
    } catch (err) {
      console.error('Error generating payment report:', err);
      setError('Failed to generate payment report');
      setLoading(false);
    }
  };

  // Generate service report
  const generateServiceReport = async () => {
    if (!selectedPlateNumber) {
      setError('Please select a car');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setServiceReport(null);

      const report = await reportService.getServicesByPlateNumber(selectedPlateNumber);
      setServiceReport(report);
      setLoading(false);
    } catch (err) {
      console.error('Error generating service report:', err);
      setError('Failed to generate service report');
      setLoading(false);
    }
  };

  // Export payment report to PDF
  const exportPaymentReportToPDF = () => {
    if (!paymentReport) {
      alert('No payment report data available');
      return;
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(18);
      doc.setTextColor(205, 127, 50); // Amber color
      doc.text('Smart Park Car Wash', 105, 15, null, null, 'center');

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Payment Report', 105, 25, null, null, 'center');

      // Add report details
      doc.setFontSize(10);
      doc.text(`Period: ${new Date(paymentReport.startDate).toLocaleDateString()} to ${new Date(paymentReport.endDate).toLocaleDateString()}`, 14, 35);
      doc.text(`Total Payments: ${paymentReport.count}`, 14, 40);
      doc.text(`Total Amount: RWF ${paymentReport.totalAmount}`, 14, 45);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 50);

      // Prepare table data
      const tableColumn = ["Payment #", "Date", "Service Details", "Amount Paid"];
      const tableRows = [];

      // Make sure we have payment data
      if (paymentReport.payments && paymentReport.payments.length > 0) {
        paymentReport.payments.forEach(payment => {
          const sp = payment.ServicePackage;
          const serviceDetails = sp ? `${sp.Car?.PlateNumber || 'N/A'} - ${sp.Package?.PackageName || 'N/A'}` : 'N/A';

          const paymentData = [
            payment.PaymentNumber,
            new Date(payment.PaymentDate).toLocaleDateString(),
            serviceDetails,
            `RWF ${payment.AmountPaid}`
          ];
          tableRows.push(paymentData);
        });
      } else {
        tableRows.push(['No payment data available', '', '', '']);
      }

      // Add table to document using the imported autoTable function
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 193, 7] }, // Amber color
      });

      // Get the final Y position after the table
      const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY : 150;

      // Add signature section
      doc.text('Signature:', 14, finalY + 20);
      doc.line(35, finalY + 20, 100, finalY + 20); // Signature line

      doc.text('Date:', 120, finalY + 20);
      doc.line(135, finalY + 20, 180, finalY + 20); // Date line

      doc.text('Prepared by: ___________________', 14, finalY + 35);
      doc.text('Approved by: ___________________', 120, finalY + 35);

      // Save the PDF
      doc.save(`Payment_Report_${startDate}_to_${endDate}.pdf`);

      console.log('Payment PDF generated successfully');
    } catch (error) {
      console.error('Error generating payment PDF:', error);
      alert('Error generating PDF: ' + (error.message || 'Please try again.'));
    }
  };

  // Export service report to PDF
  const exportServiceReportToPDF = () => {
    if (!serviceReport) {
      alert('No service report data available');
      return;
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(18);
      doc.setTextColor(205, 127, 50); // Amber color
      doc.text('Smart Park Car Wash', 105, 15, null, null, 'center');

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Service Report', 105, 25, null, null, 'center');

      // Add report details
      doc.setFontSize(10);
      doc.text(`Car: ${serviceReport.car.PlateNumber} - ${serviceReport.car.CarType}`, 14, 35);
      doc.text(`Driver: ${serviceReport.car.DriverName}`, 14, 40);
      doc.text(`Phone: ${serviceReport.car.PhoneNumber}`, 14, 45);
      doc.text(`Total Services: ${serviceReport.count}`, 14, 50);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 55);

      // Prepare table data
      const tableColumn = ["Record #", "Date", "Package", "Price", "Payment Status"];
      const tableRows = [];

      // Make sure we have service data
      if (serviceReport.services && serviceReport.services.length > 0) {
        serviceReport.services.forEach(service => {
          const serviceData = [
            service.RecordNumber,
            new Date(service.ServiceDate).toLocaleDateString(),
            service.Package?.PackageName || 'N/A',
            `RWF ${service.Package?.PackagePrice || 0}`,
            service.Payment ? 'Paid' : 'Unpaid'
          ];
          tableRows.push(serviceData);
        });
      } else {
        tableRows.push(['No service data available', '', '', '', '']);
      }

      // Add table to document using the imported autoTable function
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 193, 7] }, // Amber color
      });

      // Get the final Y position after the table
      const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY : 150;

      // Add signature section
      doc.text('Signature:', 14, finalY + 20);
      doc.line(35, finalY + 20, 100, finalY + 20); // Signature line

      doc.text('Date:', 120, finalY + 20);
      doc.line(135, finalY + 20, 180, finalY + 20); // Date line

      doc.text('Prepared by: ___________________', 14, finalY + 35);
      doc.text('Approved by: ___________________', 120, finalY + 35);

      // Save the PDF
      doc.save(`Service_Report_${serviceReport.car.PlateNumber}.pdf`);

      console.log('Service PDF generated successfully');
    } catch (error) {
      console.error('Error generating service PDF:', error);
      alert('Error generating PDF: ' + (error.message || 'Please try again.'));
    }
  };

  // Table columns for payment report
  const paymentColumns = [
    { key: 'PaymentNumber', label: 'Payment #' },
    {
      key: 'PaymentDate',
      label: 'Date',
      render: (row) => new Date(row.PaymentDate).toLocaleDateString()
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

  // Table columns for service report
  const serviceColumns = [
    { key: 'RecordNumber', label: 'Record #' },
    {
      key: 'ServiceDate',
      label: 'Date',
      render: (row) => new Date(row.ServiceDate).toLocaleDateString()
    },
    {
      key: 'Package',
      label: 'Package',
      render: (row) => row.Package?.PackageName || 'N/A'
    },
    {
      key: 'Price',
      label: 'Price',
      render: (row) => `$${row.Package?.PackagePrice || 0}`
    },
    {
      key: 'Payment',
      label: 'Payment Status',
      render: (row) => row.Payment ? 'Paid' : 'Unpaid'
    }
  ];

  return (
    <Layout title="Reports" onLogout={onLogout}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Payment Report Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Report</h2>

          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              onClick={generatePaymentReport}
              className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          {paymentReport && (
            <div className="mt-6">
              <div className="bg-gray-100 p-4 rounded mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Total Payments: {paymentReport.count}</p>
                    <p className="font-medium text-lg text-amber-500">
                      Total Amount: ${paymentReport.totalAmount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Period: {new Date(paymentReport.startDate).toLocaleDateString()} to {new Date(paymentReport.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={exportPaymentReportToPDF}
                    className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md flex items-center"
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    Export PDF
                  </button>
                </div>
              </div>

              <Table
                columns={paymentColumns}
                data={paymentReport.payments}
                actions={false}
              />
            </div>
          )}
        </div>

        {/* Service Report Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Service Report</h2>

          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="plateNumber" className="form-label">Car Plate Number</label>
              <select
                id="plateNumber"
                value={selectedPlateNumber}
                onChange={(e) => setSelectedPlateNumber(e.target.value)}
                className="form-input"
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.PlateNumber} value={car.PlateNumber}>
                    {car.PlateNumber} - {car.CarType} ({car.DriverName})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateServiceReport}
              className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          {serviceReport && (
            <div className="mt-6">
              <div className="bg-gray-100 p-4 rounded mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Car: {serviceReport.car.PlateNumber} - {serviceReport.car.CarType}
                    </p>
                    <p className="font-medium">
                      Driver: {serviceReport.car.DriverName}
                    </p>
                    <p className="font-medium">
                      Total Services: {serviceReport.count}
                    </p>
                  </div>
                  <button
                    onClick={exportServiceReportToPDF}
                    className="px-4 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md flex items-center"
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    Export PDF
                  </button>
                </div>
              </div>

              <Table
                columns={serviceColumns}
                data={serviceReport.services}
                actions={false}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
