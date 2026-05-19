import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../pages/utils/formatCurrency';
import { getProductImage, handleImageError } from '../../services/imageService';

const FeaturedProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/products/${product._id}`}>
                <div className="relative pb-[100%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => handleImageError(e, product)}
                    loading="lazy"
                  />
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Low Stock
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-lg font-semibold mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-1 dark:text-white">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(product.price)}
                  </span>
                  <Link
                    to={`/products/${product._id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;