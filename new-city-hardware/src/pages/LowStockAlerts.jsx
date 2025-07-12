import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import electrical from '../assets/electrical.png'; // Replace with real image

const initialItems = [
  { id: 1, name: 'Hammer', category: 'Tools', stock: 5, image: electrical, done: false },
  { id: 2, name: 'Screwdriver', category: 'Tools', stock: 3, image: electrical, done: false },
  { id: 3, name: 'Paint Brush', category: 'Paints', stock: 4, image: electrical, done: false },
];

export default function LowStockAlerts() {
  const [items, setItems] = useState(initialItems);

  const ignoreItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const markAsDone = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: true } : item
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-2">Low Stock Alerts</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor Key Inventory Warnings</p>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition
                  ${item.done ? 'bg-blue-100 opacity-80' : 'bg-gray-50 hover:shadow-md'}
                `}
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="text-sm text-gray-600"><strong>Category:</strong> {item.category}</p>
                    <p className="text-sm text-gray-600"><strong>Item:</strong> {item.name}</p>
                    <p className="text-red-600 font-semibold text-sm">Current Stock: {item.stock}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    className={`text-sm px-4 py-2 rounded transition ${
                      item.done
                        ? 'bg-blue-500 text-white cursor-not-allowed opacity-80'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                    onClick={() => markAsDone(item.id)}
                    disabled={item.done}
                  >
                    {item.done ? 'Marked Done' : 'Mark as Done'}
                  </button>
                  <button
                    onClick={() => ignoreItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
                    disabled={item.done}
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">
                All stock levels are healthy.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
