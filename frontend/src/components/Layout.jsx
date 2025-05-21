import { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, title, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - fixed on mobile, static on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:shrink-0
      `}>
        <Sidebar onLogout={onLogout} />
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-600 focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>

          <div className="flex items-center">
            <span className="text-gray-600 mr-2 hidden sm:inline">
              {JSON.parse(localStorage.getItem('user'))?.Username || 'User'}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
              {(JSON.parse(localStorage.getItem('user'))?.Username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
