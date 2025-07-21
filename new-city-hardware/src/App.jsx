import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { trackVisitor } from './utils/trackVisitor';

import Home from './pages/user/Home.jsx';
import About from './pages/user/About.jsx';
import Products from './pages/user/Product.jsx';
import Contact from './pages/user/Contact.jsx';
import Cart from './pages/user/Cart.jsx';
import Login from './pages/Login';
import ProductView from './pages/user/ProductView.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminAddProduct from './pages/admin/AdminAddProduct.jsx';
import AdminUpdateItems from './pages/admin/AdminUpdateItems.jsx';
import LowStockAlerts from './pages/admin/LowStockAlerts.jsx';
import AdminCustomerOrders from './pages/admin/AdminCustomerOrders.jsx';

function Layout({ children }) {
  const { role } = useAuth();
  const showHeaderFooter = role !== 'admin';

  return (
    <>
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  const { loading } = useAuth();

  useEffect(() => {
    trackVisitor(); // track visit on load
  }, []);

  if (loading) return <Loader />;

  return (
    <CartProvider>
      <Router>
        <Toaster position="top-center" />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:category/:id" element={<ProductView />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Protected Routes */}
            <Route path="/admindash" element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute roleRequired="admin">
                <AdminAddProduct />
              </ProtectedRoute>
            } />
            <Route path="/update-product" element={
              <ProtectedRoute roleRequired="admin">
                <AdminUpdateItems />
              </ProtectedRoute>
            } />
            <Route path="/lowstock" element={
              <ProtectedRoute roleRequired="admin">
                <LowStockAlerts />
              </ProtectedRoute>
            } />
            <Route path="/PreOrder" element={
              <ProtectedRoute roleRequired="admin">
                <AdminCustomerOrders />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
