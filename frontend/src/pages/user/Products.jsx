// src/pages/user/Products.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../utils/formatCurrency';
import { PRODUCT_CATEGORIES } from '../utils/constants';
import Pagination from '../../components/ui/Pagination';
import Loader from '../../components/ui/Loader';
import { getProductImage, handleImageError } from '../../services/imageService';
import toast from 'react-hot-toast';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
        <div className="flex justify-between items-start">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-1 dark:text-white">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={toggleWishlist}
            className="text-red-500 hover:scale-110 transition-transform"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <HeartSolid className="h-5 w-5" />
            ) : (
              <HeartOutline className="h-5 w-5" />
            )}
          </button>
        </div>
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
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  const { products, loading, totalPages, totalProducts } = useProducts(filters);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSortChange = (value) => {
    let sortParam = '';
    if (value === 'price_asc') sortParam = 'price';
    if (value === 'price_desc') sortParam = '-price';
    if (value === 'newest') sortParam = '-createdAt';
    handleFilterChange('sort', sortParam);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">All Products</h1>

   
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="input rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="input rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={
              filters.sort === 'price' ? 'price_asc' :
              filters.sort === '-price' ? 'price_desc' :
              filters.sort === '-createdAt' ? 'newest' : ''
            }
            onChange={(e) => handleSortChange(e.target.value)}
            className="input rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Showing {products.length} of {totalProducts} products
        </div>
      </div>

      
      {loading ? (
        <Loader />
      ) : (
        <>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

        
          {totalPages > 1 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Products;