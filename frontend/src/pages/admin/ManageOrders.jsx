import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useOrders } from '../../hooks/useOrders';
import orderService from '../../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '../utils/constants';

const ManageOrders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { orders, loading, setOrders } = useOrders(true, { status: statusFilter });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Manage Orders</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Orders</option>
            {Object.values(ORDER_STATUS).map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 dark:text-gray-300">Order ID</th>
                <th className="text-left py-3 px-4 dark:text-gray-300">Customer</th>
                <th className="text-left py-3 px-4 dark:text-gray-300">Amount</th>
                <th className="text-left py-3 px-4 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 dark:text-gray-300">Date</th>
                <th className="text-left py-3 px-4 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="py-3 px-4 font-mono text-sm dark:text-gray-200">{order._id.slice(-8)}</td>
                  <td className="py-3 px-4 dark:text-gray-200">{order.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4 dark:text-gray-200">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${ORDER_STATUS_COLORS[order.status]} border-0 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800`}
                    >
                      {Object.values(ORDER_STATUS).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm dark:text-gray-200">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;