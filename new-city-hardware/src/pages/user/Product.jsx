import { useState } from 'react';
import {
  FiSearch,
  FiShoppingCart,
  FiFilter,
  FiGrid,
  FiList,
  FiTool,
  FiEdit3,
  FiDroplet,
  FiAnchor,
  FiZap,
  FiSettings,
  FiFeather,
  FiX,
  FiMenu,
} from 'react-icons/fi';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Products() {
  const [layout, setLayout] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: 'All Brands',
    price: '',
    sort: 'Featured',
    category: 'All Products',
  });

  const categoryIcons = {
    'All Products': FiSettings,
    'Power Tools': FiTool,
    'Hand Tools': FiEdit3,
    'Paint & Supplies': FiDroplet,
    'Fasteners': FiAnchor,
    'Smart Tools': FiZap,
    'Eco-Friendly': FiFeather,
  };

  const categoryColors = {
    'All Products': 'bg-slate-600',
    'Power Tools': 'bg-cyan-500',
    'Hand Tools': 'bg-emerald-500',
    'Paint & Supplies': 'bg-pink-500',
    'Fasteners': 'bg-orange-500',
    'Smart Tools': 'bg-yellow-500',
    'Eco-Friendly': 'bg-green-500',
  };

  const { products, brands, loading } = useProducts(filters);
  const { categories, loading: catLoading } = useCategories();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (product) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return toast.error('You must be logged in to add items to cart.');

    if (product.stocks <= 0) return toast.error('This item is out of stock.');
    
    setAddingId(product.id);

    try {
      const cartItemRef = doc(db, 'carts', userId, 'items', product.id.toString());
      const docSnap = await getDoc(cartItemRef);

      const currentQty = docSnap.exists() ? docSnap.data().quantity : 0;

      if (currentQty + 1 > product.stocks) {
        return toast.error(`Only ${product.stocks} items in stock.`);
      }

      if (docSnap.exists()) {
        await updateDoc(cartItemRef, {
          quantity: currentQty + 1,
        });
      } else {
        await setDoc(cartItemRef, {
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          stocks: product.stocks,
          category: product.category
        });
      }toast.success(`${product.name} added to cart.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingId(null); // reset
    }
  };

  return (
  <main className="min-h-screen bg-white text-black flex">
    {/* Sidebar */}
    {isSidebarOpen && (
      <aside className="w-60 sticky top-0 h-screen overflow-y-auto bg-gray-100 border-r border-gray-200 p-6 space-y-4 z-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-black hover:text-gray-500">
            <FiX size={20} />
          </button>
        </div>
        {catLoading ? (
          <p className="text-sm text-gray-600">Loading categories...</p>
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

    {/* Main Content */}
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

        {/* Filter Bar */}
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

            {/* Dropdowns */}
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

            {/* Toggle View */}
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

            {/* Clear */}
            <button
              onClick={() => setFilters({ search: '', brand: 'All Brands', price: '', sort: 'Featured', category: 'All Products' })}
              className="flex items-center gap-2 px-5 py-2 bg-white text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              <FiFilter />
              <span className="font-semibold">Clear</span>
            </button>
          </div>
        </section>

        {/* Product Grid/List */}
        {loading ? (
          <p className="text-center text-xl text-gray-600">Loading products...</p>
        ) : (
          <div
            className={`grid gap-6 ${
              layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md"
              >
                {/* Product Image */}
                <Link to={`/product/${product.category}/${product.id}`}>
                  <div className="relative">
                    <div className="w-full h-48 sm:h-52 md:h-56 flex items-center justify-center bg-white-100 rounded-t-2xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    {/* Label Badge */}
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

                {/* Product Info */}
                <div className="p-4 sm:p-5 space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-black line-clamp-2">
                    {product.name}
                  </h2>

                  <div className="flex flex-wrap justify-between items-center pt-3 gap-y-2">
                    <span className="text-black font-bold text-sm sm:text-base">
                      Rs. {product.price}
                    </span>
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
