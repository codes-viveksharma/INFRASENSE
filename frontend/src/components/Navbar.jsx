import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Complaints', path: '/complaints' },
    { name: 'Alerts', path: '/alerts' },
  ];
  
  return (
    <nav className="bg-white dark:bg-dark-bg shadow-md dark:shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-smart-blue dark:text-blue-400">
              SmartCity Monitor
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-smart-blue dark:text-blue-400 border-b-2 border-smart-blue dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              to="/dashboard" 
              className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;