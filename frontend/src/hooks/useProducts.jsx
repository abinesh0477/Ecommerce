import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(filters);
        if (!cancelled) {
          setProducts(response.products || []);
          setTotalPages(response.pages || 1);
          setTotalProducts(response.total || 0);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [JSON.stringify(filters)]);

  return { products, loading, error, totalPages, totalProducts, setProducts };
};