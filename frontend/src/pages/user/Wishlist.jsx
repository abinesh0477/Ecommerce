import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { getProductImage, handleImageError } from '../../services/imageService';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Save your favorite items here and shop them later.
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Link to={`/products/${product._id}`}>
              <div className="relative pb-[100%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                  onError={(e) => handleImageError(e, product)}
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 dark:text-white">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(product.price)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                    aria-label="Add to cart"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                    aria-label="Remove from wishlist"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;