import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../utils/formatCurrency';
import { getProductImage, handleImageError } from '../../services/imageService';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const cartItems = cart?.items || [];
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * (item.quantity || 0);
  }, 0);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId, productName) => {
    if (window.confirm(`Remove ${productName} from cart?`)) {
      try {
        await removeItem(productId);
        toast.success('Item removed from cart');
      } catch (error) {
        toast.error('Failed to remove item');
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>

      <div className="lg:flex lg:gap-8">
        
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <div key={item.product?._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => handleImageError(e, item.product)}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{item.product?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {formatCurrency(item.product?.price || 0)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        -
                      </button>
                      <span className="w-12 text-center dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product?._id, item.product?.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency((item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between dark:text-gray-300">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="dark:text-white">Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="block text-center mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;