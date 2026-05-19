import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

export const useOrders = (adminView = false, params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (adminView) {
        data = await orderService.getAllOrders(params);
       
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
        setTotalOrders(data.total || 0);
      } else {
        data = await orderService.getUserOrders();
       
        setOrders(Array.isArray(data) ? data : []);
        setTotalPages(1);
        setTotalOrders(data.length || 0);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [adminView, JSON.stringify(params)]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (orderId) => {
    try {
      const updated = await orderService.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const refetch = () => fetchOrders();

  return { orders, loading, error, totalPages, totalOrders, setOrders, cancelOrder, refetch };
};