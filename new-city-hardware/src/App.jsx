import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Product';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminUpdateItems from './pages/AdminUpdateItems';
import LowStockAlerts from './pages/LowStockAlerts';
import AdminCustomerOrders from './pages/AdminCustomerOrders'; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admindash" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AdminAddProduct />} />
        <Route path="/update-product" element={<AdminUpdateItems />} /> 
        <Route path="/lowstock" element={<LowStockAlerts />} />
        <Route path="/PreOrder" element={<AdminCustomerOrders />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
