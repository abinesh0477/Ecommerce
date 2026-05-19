import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: HomeIcon },
  { label: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
  { label: 'Manage Products', path: '/admin/products', icon: CubeIcon },
  { label: 'Manage Orders', path: '/admin/orders', icon: ShoppingBagIcon },
  { label: 'Manage Users', path: '/admin/users', icon: UsersIcon },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
  
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-indigo-400">ShopHub Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive =
              path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;