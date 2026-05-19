import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AdminLayout from './components/common/AdminLayout';
import Loader from './components/ui/Loader';


const Home = lazy(() => import('./pages/user/Home'));
const Products = lazy(() => import('./pages/user/Products'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const Login = lazy(() => import('./pages/user/Login'));
const Register = lazy(() => import('./pages/user/Register'));
const MyOrders = lazy(() => import('./pages/user/MyOrders'));
const OrderSuccess = lazy(() => import('./pages/user/OrderSuccess'));
const Profile = lazy(() => import('./pages/user/Profile'));
const OrderDetail = lazy(() => import('./pages/user/OrderDetail'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const ProductForm = lazy(() => import('./pages/admin/ProductForm'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<Loader fullScreen />}>
                <Routes>
               
                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/:id/edit" element={<ProductForm />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="orders/:id" element={<AdminOrderDetail />} />
                    <Route path="users" element={<ManageUsers />} />
                  </Route>

                 
                  <Route path="/" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Home /></main><Footer /></div>} />
                  <Route path="/products" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Products /></main><Footer /></div>} />
                  <Route path="/products/:id" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><ProductDetail /></main><Footer /></div>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Cart /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Checkout /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><MyOrders /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><OrderDetail /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><OrderSuccess /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Profile /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Wishlist /></main><Footer /></div></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;