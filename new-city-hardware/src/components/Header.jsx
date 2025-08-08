import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart,
  FiUserPlus,
  FiMenu,
  FiX,
  FiLogOut,
  FiTruck,
  FiSearch
} from "react-icons/fi";
import logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import Swal from 'sweetalert2';
import { Toast } from '../utils/toast';
import { collectionGroup, onSnapshot } from "firebase/firestore";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
      Toast.fire({ icon: 'success', title: 'Logged out successfully' });
      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    if (!isHome || debouncedSearch.trim() === "") {
      setSearchResults([]);
      return;
    }

    const unsub = onSnapshot(collectionGroup(db, "items"), (snapshot) => {
      const allProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allProducts
        .filter((p) =>
          p?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .reduce((unique, item) => {
          const exists = unique.find((x) => x.name === item.name);
          if (!exists) unique.push(item);
          return unique;
        }, [])
        .slice(0, 6);

      setSearchResults(filtered);
    });

    return () => unsub();
  }, [isHome, debouncedSearch]);

  useEffect(() => {
    setSearch("");
    setSearchResults([]);
  }, [location.pathname]);

  return (
    <header className="bg-slate-900 text-white shadow h-16 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
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

        {isHome && (
          <div className="relative flex-1 hidden md:block left-15">
            <FiSearch className="absolute top-3.5 left-4 text-black" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-90 pl-12 pr-4 py-3 rounded-xl bg-gray-100 text-[#0B1F3B] placeholder:text-[#0B1F3B]/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-20 bg-white text-[#0B1F3B] w-100 mt-2 rounded-xl shadow-lg border border-[#0B1F3B]/20 max-h-80 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[#0B1F3B]/5 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${item.category}/${item.id}`);
                      setSearch("");
                      setSearchResults([]);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <nav className="hidden md:flex items-center space-x-6 text-sm ml-auto">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <Link to="/products" className="hover:text-blue-400">Products</Link>
          <Link to="/about" className="hover:text-blue-400">About</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
          <button
            onClick={() => handleNavigate('/orders')}
            className="hover:text-blue-400 flex items-center gap-1"
          >
            <FiTruck size={18} /> Orders
          </button>
          <Link to="/cart" className="hover:text-blue-400 relative flex items-center gap-1">
            <FiShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link to="/login" className="hover:text-blue-400 flex items-center gap-1">
              <FiUserPlus size={18} /> Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="hover:text-blue-400 flex items-center gap-1">
              <FiLogOut size={18} /> Logout
            </button>
          )}
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          data-cy="mobile-menu-toggle"
          className="md:hidden ml-auto text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-800 text-sm flex flex-col items-start px-6 py-4 space-y-3">
          {isHome && (
            <div className="w-full">
              <div className="relative">
                <FiSearch className="absolute top-3.5 left-4 text-black" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-[#0B1F3B] placeholder:text-[#0B1F3B]/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-20 bg-white text-[#0B1F3B] w-full mt-2 rounded-xl shadow-lg border border-[#0B1F3B]/20 max-h-80 overflow-y-auto">
                    {searchResults.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-[#0B1F3B]/5 cursor-pointer"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate(`/product/${item.category}/${item.id}`);
                          setSearch("");
                          setSearchResults([]);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">Home</Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400" data-cy="nav-link-products">Products</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400">Contact</Link>
          <button
            onClick={() => { setIsMobileMenuOpen(false); handleNavigate('/orders'); }}
            className="hover:text-blue-400 flex items-center gap-2"
          >
            <FiTruck size={18} /> Orders
          </button>
          <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 flex items-center gap-2">
            <FiShoppingCart size={18} /> Cart
          </Link>
          {!user ? (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 flex items-center gap-2">
              <FiUserPlus size={18} /> Login
            </Link>
          ) : (
            <button
              onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
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

function useDebounce(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default Header;
