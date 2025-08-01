import { useState, useEffect } from 'react';
import {
  FiSettings,
  FiTool,
  FiEdit3,
  FiDroplet,
  FiAnchor,
  FiZap,
  FiFeather,
  FiShield,
  FiMinus,
  FiLock,
  FiSunrise,
  FiTrash2,
  FiPaperclip,
  FiSun,
  FiGrid,
  FiMap,
  FiThermometer,
  FiBattery,
  FiTruck,
  FiBox,
  FiLayers,
  FiX,
  FiSearch,
  FiList,
  FiFilter,
  FiShoppingCart,
} from 'react-icons/fi';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import toast from 'react-hot-toast';
import { Link, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Toast } from '../../utils/toast';

export default function Products() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const [layout, setLayout] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: 'All Brands',
    price: '',
    sort: 'Featured',
    category: selectedCategory || 'All Products',
  });

  const categoryIcons = {
    'All Products': FiSettings,
    'Power Tools': FiTool,
    'Hand Tools': FiEdit3,
    'Paint & Supplies': FiDroplet,
    'Fasteners': FiAnchor,
    'Smart Tools': FiZap,
    'Eco-Friendly': FiFeather,
    'Plumbing': FiDroplet,
    'Electrical Tools': FiZap,
    'Construction Materials': FiLayers,
    'Garden Tools': FiSun,
    'Safety Equipment': FiShield,
    'Adhesives & Tapes': FiPaperclip,
    'Lighting': FiSunrise,
    'Cleaning Supplies': FiTrash2,
    'Locks & Security': FiLock,
    'Measurement Tools': FiMinus,
    'Paint Accessories': FiEdit3,
    'Automotive': FiTruck,
    'Woodworking': FiGrid,
    'Flooring': FiMap,
    'HVAC': FiThermometer,
    'Batteries': FiBattery,
    'Miscellaneous': FiBox,
  };

  const categoryColors = {
    'All Products': 'bg-slate-600',
    'Power Tools': 'bg-cyan-500',
    'Hand Tools': 'bg-emerald-500',
    'Paint & Supplies': 'bg-pink-500',
    'Fasteners': 'bg-orange-500',
    'Smart Tools': 'bg-yellow-500',
    'Eco-Friendly': 'bg-green-500',
    'Plumbing': 'bg-blue-500',
    'Electrical Tools': 'bg-yellow-600',
    'Construction Materials': 'bg-gray-600',
    'Garden Tools': 'bg-green-400',
    'Safety Equipment': 'bg-red-500',
    'Adhesives & Tapes': 'bg-purple-400',
    'Lighting': 'bg-yellow-400',
    'Cleaning Supplies': 'bg-gray-400',
    'Locks & Security': 'bg-indigo-600',
    'Measurement Tools': 'bg-indigo-400',
    'Paint Accessories': 'bg-pink-400',
    'Automotive': 'bg-teal-500',
    'Woodworking': 'bg-orange-400',
    'Flooring': 'bg-lime-500',
    'HVAC': 'bg-blue-400',
    'Batteries': 'bg-yellow-300',
    'Miscellaneous': 'bg-gray-500',
  };


  const { products, brands, loading } = useProducts(filters);
  const { categories, loading: catLoading } = useCategories();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (product) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Toast.fire({
      icon: 'error',
      title: 'You must be logged in to add items to cart.',
    });

    if (product.stocks <= 0) return toast.error('This item is out of stock.');
    
    setAddingId(product.id);

    try {
      const cartItemRef = doc(db, 'carts', userId, 'items', product.id.toString());
      const docSnap = await getDoc(cartItemRef);

      const currentQty = docSnap.exists() ? docSnap.data().quantity : 0;

      if (currentQty + 1 > product.stocks) {
        return Toast.fire({
          icon: 'error',
          title: `Only ${product.stocks} items in stock.`,
        });
      }

      if (docSnap.exists()) {
        await updateDoc(cartItemRef, {
          quantity: currentQty + 1,
        });
      } else {
        await setDoc(cartItemRef, {
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          image: product.image,
          quantity: 1,
          stocks: product.stocks,
          category: product.category
        });
      }Toast.fire({
        icon: 'success',
        title: `${product.name} added to cart.`,
      });

    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: "Failed to add to cart.",
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
  <main className="min-h-screen bg-white text-black flex">
    {isSidebarOpen && (
      <aside className="w-60 sticky top-0 h-screen overflow-y-auto bg-gray-100 border-r border-gray-200 p-6 space-y-4 z-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-black hover:text-gray-500">
            <FiX size={20} />
          </button>
        </div>
        {catLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton width={40} height={40} circle />
                <div className="flex-1">
                  <Skeleton height={14} width={`80%`} />
                  <Skeleton height={12} width={`60%`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          categories.map((cat) => {
            const Icon = categoryIcons[cat.name] || FiSettings;
            const color = categoryColors[cat.name] || 'bg-gray-300';

            return (
              <div
                key={cat.name}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.name }))}
                className="group cursor-pointer rounded-xl px-4 py-4 border border-gray-200 hover:border-black transition-all duration-300 bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white text-lg ${color} shadow-md`}>
                    <Icon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-black">{cat.name}</h4>
                    <p className="text-xs text-gray-500">{cat.items} items</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </aside>
    )}

    <div className="flex-1 px-4 py-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {!isSidebarOpen && (
          <div className="mb-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-black bg-gray-100 border border-gray-300 px-3 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              <FiMenu />
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Our Products</h1>
        </div>

        <section className="mb-12">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-xl flex-1 min-w-[200px] max-w-md border border-gray-300">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-black placeholder-gray-500 focus:outline-none w-full"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <select
              value={filters.brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
              className="bg-white text-black px-4 py-2 rounded-xl border border-gray-300 focus:outline-none"
            >
              {brands.map((brand, i) => (
                <option key={i} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={filters.price}
              onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
              className="bg-white text-black px-4 py-2 rounded-xl border border-gray-300 focus:outline-none"
            >
              <option value="">All Prices</option>
              <option>Under Rs.5000</option>
              <option>Rs.5000–Rs.10000</option>
              <option>Above Rs.10000</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="bg-white text-black px-4 py-2 rounded-xl border border-gray-300 focus:outline-none"
            >
              <option>Featured</option>
              <option>Newest</option>
              <option>Best Selling</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setLayout('grid')}
                className={`px-3 py-2 rounded-xl border ${
                  layout === 'grid' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`px-3 py-2 rounded-xl border ${
                  layout === 'list' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                <FiList />
              </button>
            </div>

            <button
              onClick={() => setFilters({ search: '', brand: 'All Brands', price: '', sort: 'Featured', category: 'All Products' })}
              className="flex items-center gap-2 px-5 py-2 bg-white text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              <FiFilter />
              <span className="font-semibold">Clear</span>
            </button>
          </div>
        </section>

        {loading ? (
          <div
            className={`grid gap-6 ${
              layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl shadow w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md p-4"
              >
                <Skeleton height={200} />
                <Skeleton height={20} className="mt-3" />
                <Skeleton height={20} width={100} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-100 border border-gray-200 rounded-2xl shadow hover:shadow-md transition w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md"
              >
                <Link to={`/product/${product.category}/${product.id}`}>
                  <div className="relative">
                    <div className="w-full h-48 sm:h-52 md:h-56 flex items-center justify-center bg-white-100 rounded-t-2xl overflow-hidden">
                      <div className="relative w-full h-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain rounded"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`absolute top-2 right-2 text-[11px] sm:text-xs px-2 py-1 rounded-full font-semibold text-white ${
                        product.label === 'Out of Stock'
                          ? 'bg-red-600'
                          : product.label === 'Low Stock'
                          ? 'bg-yellow-500'
                          : 'bg-green-600'
                      }`}
                    >
                      {product.label}
                    </span>
                  </div>
                </Link>

                <div className="p-4 sm:p-5 space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-black line-clamp-2">
                    {product.name}
                  </h2>

                  <div className="flex flex-wrap justify-between items-center pt-3 gap-y-2">
                    {product.discount > 0 ? (
                      <span className="text-sm sm:text-base text-red-600 font-semibold">
                        Rs. {(product.price * (1 - product.discount / 100)).toFixed(2)} 
                        <span className="text-gray-400 line-through ml-2 text-xs">
                          Rs. {product.price.toFixed(2)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-black font-bold text-sm sm:text-base">
                        Rs. {product.price.toFixed(2)}
                      </span>
                    )}
                    <button
                      disabled={product.stocks === 0}
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-1 text-sm font-medium transition ${
                        product.stocks === 0
                          ? 'opacity-50 cursor-not-allowed text-gray-400'
                          : 'text-black hover:text-green-600'
                      }`}
                    >
                      <FiShoppingCart className="text-base sm:text-lg" />
                      {product.stocks === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
);

}
