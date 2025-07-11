import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/Logo.png';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white shadow h-16 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center overflow-hidden">

        {/* Logo + Brand Name */}
        <Link to="/" className="flex items-center space-x-2 h-full">
          <div className="h-full flex items-center overflow-hidden">
            <img
              src={logo}
              alt="New City Hardware Logo"
              className="h-20 w-auto object-contain -my-2"
            />
          </div>
          <span className="text-lg font-semibold hidden sm:block">New City Hardware</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/products" className="hover:text-blue-400">Products</Link>
          <Link to="/about" className="hover:text-blue-400">About</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
          <Link to="/cart" className="hover:text-blue-400 flex items-center gap-1">
            <FiShoppingCart size={18} />
          </Link>
          <Link to="/login" className="hover:text-blue-400 flex items-center gap-1">
           
            <FiUserPlus size={18} />
          </Link>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-800 text-sm flex flex-col items-start px-6 py-4 space-y-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">Products</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">Contact</Link>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 flex items-center gap-2">
            <FiShoppingCart size={18} /> Cart
          </Link>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 flex items-center gap-2">
          
            <FiUserPlus size={18} /> Login
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
