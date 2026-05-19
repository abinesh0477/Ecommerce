import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../utils/formatCurrency';

const MyOrders = () => {
  const { orders, loading } = useOrders(false);``

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
          <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id?.slice(-8)}</p>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-indigo-600">{formatCurrency(order.totalAmount)}</p>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;