import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useProducts } from '../../hooks/useProducts';
import productService from '../../services/productService';
import { formatCurrency } from '../utils/formatCurrency';
import { getProductImage, handleImageError } from '../../services/imageService';

const ManageProducts = () => {
  const { products = [], loading, setProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 dark:text-gray-300">Image</th>
                <th className="text-left py-3 dark:text-gray-300">Name</th>
                <th className="text-left py-3 dark:text-gray-300">Price</th>
                <th className="text-left py-3 dark:text-gray-300">Stock</th>
                <th className="text-left py-3 dark:text-gray-300">Category</th>
                <th className="text-left py-3 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b dark:border-gray-700">
                  <td className="py-3">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => handleImageError(e, product)}
                    />
                  </td>
                  <td className="py-3 dark:text-white">{product.name}</td>
                  <td className="py-3 dark:text-white">{formatCurrency(product.price)}</td>
                  <td className="py-3">
                    <span className={product.stock < 10 ? 'text-red-600 font-semibold' : 'dark:text-white'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 dark:text-white">{product.category}</td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;