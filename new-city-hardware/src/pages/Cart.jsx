import { FiTrash2 } from 'react-icons/fi';

const cartItems = [
  {
    id: 1,
    name: 'Cordless Drill',
    price: 129.99,
    image: '/assets/drill.png',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Adjustable Wrench Set',
    price: 49.99,
    image: '/products/wrench-set.jpg',
    quantity: 2,
  },
];

export default function Cart() {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <p className="text-center text-slate-200">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-slate-300 text-sm">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-cyan-300 font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button className="text-red-400 hover:text-red-300">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-end mt-8">
              <div className="text-right space-y-2">
                <p className="text-xl font-semibold">Total:</p>
                <p className="text-2xl text-cyan-400 font-bold">
                  ${total.toFixed(2)}
                </p>
                <button className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition">
                  Proceed to Pre Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}