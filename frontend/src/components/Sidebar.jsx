import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/service-packages', label: 'Service Packages', icon: 'fas fa-box-open' },
    { path: '/packages', label: 'Packages', icon: 'fas fa-tags' },
    { path: '/cars', label: 'Cars', icon: 'fas fa-car' },
    { path: '/payments', label: 'Payments', icon: 'fas fa-money-bill-wave' },
    { path: '/reports', label: 'Reports', icon: 'fas fa-chart-bar' },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-gray-300">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-500">Smart Park</h1>
        <p className="text-xs sm:text-sm text-gray-500">Car Wash Management</p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 sm:mt-6 flex-grow overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-1 sm:mb-2">
              <Link
                to={item.path}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 text-gray-700 hover:bg-amber-100 transition-colors ${
                  location.pathname === item.path ? 'border-l-4 border-amber-500 bg-amber-50 font-medium' : ''
                }`}
              >
                <i className={`${item.icon} mr-3 text-amber-500`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="w-full p-4 sm:p-6 border-t border-gray-300 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-100 rounded transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3 text-red-500"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
