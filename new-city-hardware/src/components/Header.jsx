import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUserPlus,
  FiMenu,
  FiX,
  FiLogOut,
  FiTruck,
} from "react-icons/fi";
import logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { Toast } from '../utils/toast';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
    });

    if (result.isConfirmed) {
      await signOut(auth);
      Toast.fire({
        icon: 'success',
        title: 'Logged out successfully',
      });

      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  return (
    <header className="bg-slate-900 text-white shadow h-16 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center overflow-hidden">
        <Link to="/" className="flex items-center space-x-2 h-full">
          <div className="h-full flex items-center overflow-hidden">
            <img
              src={logo}
              alt="New City Hardware Logo"
              className="h-20 w-auto object-contain -my-2"
            />
          </div>
          <span className="text-lg font-semibold hidden sm:block">
            New City Hardware
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-400">
            Products
          </Link>
          <Link to="/about" className="hover:text-blue-400">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-400">
            Contact
          </Link>
          <button
            onClick={() => handleNavigate('/orders')}
            className="hover:text-blue-400 flex items-center gap-1"
          >
            <FiTruck size={18} /> Orders
          </button>
          <Link
            to="/cart"
            className="hover:text-blue-400 relative flex items-center gap-1"
          >
            <FiShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link
              to="/login"
              className="hover:text-blue-400 flex items-center gap-1"
            >
              <FiUserPlus size={18} /> Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-blue-400 flex items-center gap-1"
            >
              <FiLogOut size={18} /> Logout
            </button>
          )}
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-cy="mobile-menu-toggle"
          className="md:hidden text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-800 text-sm flex flex-col items-start px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-blue-400"
            data-cy="nav-link-products"
          >
            Products
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-blue-400"
          >
            Contact
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleNavigate('/orders');
            }}
            className="hover:text-blue-400 flex items-center gap-2"
          >
            <FiTruck size={18} /> Orders
          </button>
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-blue-400 flex items-center gap-2"
          >
            <FiShoppingCart size={18} /> Cart
          </Link>
          {!user ? (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-blue-400 flex items-center gap-2"
            >
              <FiUserPlus size={18} /> Login
            </Link>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="hover:text-blue-400 flex items-center gap-2"
            >
              <FiLogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
