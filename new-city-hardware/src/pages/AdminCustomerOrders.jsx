import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const sampleOrders = [
  {
    id: 1,
    name: 'Mr Rayan',
    email: 'rayan@gmail.Com',
    date: '25 June 25',
    items: ['Hammer 01', 'Sheets 05', 'Bolts 10', 'Glue Packs 02'],
    pickedUp: false,
  },
  {
    id: 2,
    name: 'Miss Dahami',
    email: 'dahami@gmail.Com',
    date: '25 June 25',
    items: ['Hammer 01', 'Sheets 05', 'Bolts 10', 'Glue Packs 02'],
    pickedUp: false,
  },
];

export default function CustomerOrders() {
  const [orders, setOrders] = useState(sampleOrders);
  const [search, setSearch] = useState('');

  const handlePickUp = (id) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, pickedUp: true } : order
      )
    );
  };

  const handleCancel = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(search.toLowerCase()) ||
    order.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-200 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-1">Customer Orders</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor Key Performance Of The Store</p>

        {/* Summary Card + Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md w-60">
            <h3 className="text-md font-semibold">Total Customer Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              Last Updated On <br /> {new Date().toUTCString()}
            </p>
          </div>
          <input
            type="text"
            placeholder="Search customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded border w-72"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-2">Order No 0{idx + 1}</h2>
              <p><strong>Customer Name:</strong> {order.name}</p>
              <p><strong>Customer Mail:</strong> {order.email}</p>
              <p><strong>Ordered Date:</strong> {order.date}</p>

              <div className="mt-3">
                <strong>Ordered Items:</strong>
                <ul className="list-disc ml-5 text-red-600 font-medium mt-1">
                  {order.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handlePickUp(order.id)}
                  className={`text-white text-sm px-5 py-2 rounded ${
                    order.pickedUp
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={order.pickedUp}
                >
                  {order.pickedUp ? 'Picked Up' : 'Pick Up'}
                </button>
                <button
                  onClick={() => handleCancel(order.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500 py-10">No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
