import React from 'react';
import Hero from '../../components/ui/Hero';
import FeaturedProducts from '../../components/ui/FeaturedProducts';
import { useProducts } from '../../hooks/useProducts';

const Home = () => {
  const { products, loading } = useProducts();

  return (
    <div>
      <Hero />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <FeaturedProducts products={products} />
      )}
    </div>
  );
};

export default Home;