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

const sampleProducts = [
  { id: 1, name: 'Cordless Drill', description: 'Powerful 18V cordless drill with two batteries.', image: '/products/cordless-drill.jpg', price: '$129.99' },
  { id: 2, name: 'Adjustable Wrench Set', description: 'Set of 4 chrome-vanadium adjustable wrenches.', image: '/products/wrench-set.jpg', price: '$49.99' },
  { id: 3, name: 'Pipe Cutter', description: 'Precision pipe cutter for PVC and copper pipes.', image: '/products/pipe-cutter.jpg', price: '$24.99' },
  { id: 4, name: 'Pipe Cutter', description: 'Precision pipe cutter for PVC and copper pipes.', image: '/products/pipe-cutter.jpg', price: '$24.99' },
  { id: 5, name: 'Pipe Cutter', description: 'Precision pipe cutter for PVC and copper pipes.', image: '/products/pipe-cutter.jpg', price: '$24.99' },
  { id: 6, name: 'Pipe Cutter', description: 'Precision pipe cutter for PVC and copper pipes.', image: '/products/pipe-cutter.jpg', price: '$24.99' },
];

const categories = [
  { name: 'All Products', items: 156, icon: FiSettings, color: 'bg-slate-600' },
  { name: 'Power Tools', items: 45, icon: FiTool, color: 'bg-cyan-500' },
  { name: 'Hand Tools', items: 38, icon: FiEdit3, color: 'bg-emerald-500' },
  { name: 'Paint & Supplies', items: 29, icon: FiDroplet, color: 'bg-pink-500' },
  { name: 'Fasteners', items: 22, icon: FiAnchor, color: 'bg-orange-500' },
  { name: 'Smart Tools', items: 18, icon: FiZap, color: 'bg-yellow-500' },
  { name: 'Eco-Friendly', items: 14, icon: FiFeather, color: 'bg-green-500' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white flex">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="w-60 sticky top-0 h-screen overflow-y-auto bg-white/10 backdrop-blur-md border-r border-white/10 p-6 space-y-4 z-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Categories</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-white hover:text-cyan-400">
              <FiX size={20} />
            </button>
          </div>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="group cursor-pointer rounded-xl px-4 py-4 border border-white/10 hover:border-cyan-400 transition-all duration-300 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white text-lg ${cat.color} shadow-md`}>
                    <Icon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{cat.name}</h4>
                    <p className="text-xs text-black-100">{cat.items} items</p>
                  </div>
                </div>
              </div>
            );
          })}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Sidebar Toggle Button */}
          {!isSidebarOpen && (
            <div className="mb-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-white bg-white/10 border border-white/20 px-3 py-2 rounded-xl hover:bg-white/20 transition"
              >
                <FiMenu />
              </button>
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Our Products</h1>
          </div>

          {/* Filter Bar */}
          <section className="mb-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
              {/* Search */}
              <div className="flex items-center bg-white/20 px-4 py-2 rounded-xl flex-1 min-w-[200px] max-w-md">
                <FiSearch className="text-black mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent text-slate-800 placeholder-slate-800 focus:outline-none w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Dropdowns */}
              <select className="bg-white/20 text-black px-4 py-2 rounded-xl focus:outline-none">
                <option>All Brands</option>
                <option>Brand A</option>
                <option>Brand B</option>
              </select>
              <select className="bg-white/20 text-black px-4 py-2 rounded-xl focus:outline-none">
                <option>All Prices</option>
                <option>Under $50</option>
                <option>$50–$100</option>
              </select>
              <select className="bg-white/20 text-black px-4 py-2 rounded-xl focus:outline-none">
                <option>Featured</option>
                <option>Newest</option>
                <option>Best Selling</option>
              </select>

              {/* Toggle View */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLayout('grid')}
                  className={`px-3 py-2 rounded-xl ${
                    layout === 'grid' ? 'bg-cyan-400 text-black' : 'bg-white/20 text-white'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`px-3 py-2 rounded-xl ${
                    layout === 'list' ? 'bg-cyan-400 text-black' : 'bg-white/20 text-white'
                  }`}
                >
                  <FiList />
                </button>
              </div>

              {/* Clear */}
              <button className="flex items-center gap-2 px-5 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition">
                <FiFilter />
                <span className="font-semibold">Clear</span>
              </button>
            </div>
          </section>

          {/* Product Grid/List */}
          <div
            className={`grid gap-8 ${
              layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-slate-300 mt-1">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-400 font-bold">{product.price}</span>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-200 text-sm">
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
