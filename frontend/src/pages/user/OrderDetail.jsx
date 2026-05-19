import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { ORDER_STATUS_COLORS } from '../utils/constants';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
        navigate('/my-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/my-orders" 
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-flex items-center gap-2"
      >
        ← Back to Orders
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Order #{order._id?.slice(-8)}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Order Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
          
          <h2 className="font-semibold text-gray-700 mb-3">Order Items</h2>
          <div className="space-y-3">
            {order.products?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-700">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-gray-800">Total Amount</span>
              <span className="text-xl font-bold text-indigo-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="px-6 py-4">
            <h2 className="font-semibold text-gray-700 mb-2">Shipping Address</h2>
            <div className="text-gray-600 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;