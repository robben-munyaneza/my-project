import Sidebar from './Sidebar';

const Layout = ({ children, title, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">
              {JSON.parse(localStorage.getItem('user'))?.Username || 'User'}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
              {(JSON.parse(localStorage.getItem('user'))?.Username || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
