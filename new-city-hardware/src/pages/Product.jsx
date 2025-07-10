import { useState } from 'react';
import {
  FiSearch,
  FiShoppingCart,
  FiFilter,
  FiGrid,
  FiList,
} from 'react-icons/fi';

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Cordless Drill',
    description: 'Powerful 18V cordless drill with two batteries.',
    image: '/products/cordless-drill.jpg',
    price: '$129.99',
  },
  {
    id: 2,
    name: 'Adjustable Wrench Set',
    description: 'Set of 4 chrome-vanadium adjustable wrenches.',
    image: '/products/wrench-set.jpg',
    price: '$49.99',
  },
  {
    id: 3,
    name: 'Pipe Cutter',
    description: 'Precision pipe cutter for PVC and copper pipes.',
    image: '/products/pipe-cutter.jpg',
    price: '$24.99',
  },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState('grid');

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-400 via-white-800 to-slate-800 px-4 py-10 text-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">Our Products</h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-12 flex flex-wrap justify-between items-center gap-4">
          {/* Search Input */}
          <div className="flex items-center bg-white/20 px-4 py-2 rounded-xl flex-1 min-w-[200px] max-w-md">
            <FiSearch className="text-white mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent text-white placeholder-slate-300 focus:outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Dropdowns */}
          <select className="bg-black/20 text-black px-4 py-2 rounded-xl focus:outline-none">
            <option>All Brands</option>
            <option>Brand A</option>
            <option>Brand B</option>
          </select>

          <select className="bg-black/20 text-black px-4 py-2 rounded-xl focus:outline-none">
            <option>All Prices</option>
            <option>Under $50</option>
            <option>$50–$100</option>
          </select>

          <select className="bg-black/20 text-black px-4 py-2 rounded-xl focus:outline-none">
            <option>Featured</option>
            <option>Newest</option>
            <option>Best Selling</option>
          </select>

          {/* View Toggle */}
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

          {/* Clear Button */}
          <button className="flex items-center gap-2 px-5 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition">
            <FiFilter />
            <span className="font-semibold">Clear</span>
          </button>
        </div>

        {/* Product Grid */}
        <div
          className={`grid gap-8 ${
            layout === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              : 'grid-cols-1'
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
              <div className="p-5 text-white">
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
    </main>
  );
}
