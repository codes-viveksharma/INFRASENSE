import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const { isAdmin, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');

  // Admin labels per user request: Home, Dashboard, Live Complaints, Resolved Issues
  const navItems = isAdmin
    ? [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Live Complaints', path: '/complaints' },
      { name: 'Resolved Issues', path: '/alerts' },
    ]
    : [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Complaints', path: '/complaints' },
      { name: 'Alerts', path: '/alerts' },
    ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert('Incorrect password! Demo password is: 12345');
    }
  };

  return (
    <nav className="bg-white dark:bg-dark-bg shadow-md transition-colors duration-300 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-smart-blue dark:text-blue-400">
              INFRA SENSE
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'text-smart-blue dark:text-blue-400 border-b-2 border-smart-blue dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isAdmin ? (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-smart-blue hover:bg-blue-700 text-white rounded-lg text-sm font-bold"
                >
                  Admin Login
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (12345)"
                className="w-full px-4 py-3 border rounded-xl"
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-smart-blue text-white rounded-xl">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;