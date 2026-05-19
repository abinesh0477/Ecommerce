import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import DarkModeToggle from './DarkModeToggle';
import { ShoppingCartIcon, UserIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
         
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ShopHub
            </Link>
          </div>

       
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Products
            </Link>
            {user && (
              <>
                <Link to="/my-orders" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition">
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            <Link to="/wishlist" className="relative">
              <HeartIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-indigo-600" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-indigo-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

           
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <UserIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}
          </div>

         
          <div className="md:hidden flex items-center space-x-3">
            <DarkModeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XMarkIcon className="h-6 w-6 dark:text-white" /> : <Bars3Icon className="h-6 w-6 dark:text-white" />}
            </button>
          </div>
        </div>

    
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-700">
            <Link to="/products" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link to="/wishlist" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
              Wishlist
            </Link>
            {user && (
              <>
                <Link to="/my-orders" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                  My Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="block py-2 text-gray-700 dark:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 dark:text-gray-300"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="block py-2 text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;