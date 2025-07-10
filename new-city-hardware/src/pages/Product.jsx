import { useState } from 'react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: 'Cordless Drill',
    description: 'Powerful 18V cordless drill with two batteries.',
    image: '/products/cordless-drill.jpg',
    price: '$129.99'
  },
  {
    id: 2,
    name: 'Adjustable Wrench Set',
    description: 'Set of 4 chrome-vanadium adjustable wrenches.',
    image: '/products/wrench-set.jpg',
    price: '$49.99'
  },
  {
    id: 3,
    name: 'Pipe Cutter',
    description: 'Precision pipe cutter for PVC and copper pipes.',
    image: '/products/pipe-cutter.jpg',
    price: '$24.99'
  },
];

export default function Products() {
  const [search, setSearch] = useState('');

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="px-4 py-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Our Products</h1>
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute top-3.5 left-4 text-slate-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">{product.price}</span>
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    <FiShoppingCart className="mr-1" /> Add to Cart
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
