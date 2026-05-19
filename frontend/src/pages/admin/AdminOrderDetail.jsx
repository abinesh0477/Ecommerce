import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../utils/constants';
import { getProductImage, handleImageError } from '../../services/imageService';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, newStatus);
      setOrder(updatedOrder);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to="/admin/orders"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-bold mt-2 dark:text-white">Order #{order._id?.slice(-8)}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold dark:text-white">Status:</label>
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${ORDER_STATUS_COLORS[order.status]} border-0 focus:ring-2 focus:ring-indigo-500`}
            >
              {Object.values(ORDER_STATUS).map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Items</h2>
            <div className="space-y-4">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
                  <div className="flex gap-4">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => handleImageError(e, item.product)}
                    />
                    <div>
                      <p className="font-semibold dark:text-white">{item.product?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.product?._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold dark:text-white">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="flex justify-between text-lg font-bold">
                <span className="dark:text-white">Total Amount</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Customer Information</h2>
            <div className="space-y-2 dark:text-gray-300">
              <p><span className="font-semibold">Name:</span> {order.user?.name}</p>
              <p><span className="font-semibold">Email:</span> {order.user?.email}</p>
              <p><span className="font-semibold">User ID:</span> {order.user?._id}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Shipping Address</h2>
            {order.shippingAddress && (
              <div className="space-y-1 dark:text-gray-300">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Order Timeline</h2>
            <div className="space-y-3 dark:text-gray-300">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Order Placed:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Last Updated:</span>
                  <span>{new Date(order.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;