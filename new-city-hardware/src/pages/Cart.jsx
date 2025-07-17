import { useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user, authLoading } = useAuthState();
  const userId = user?.uid;
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;

      const itemsRef = collection(db, 'carts', userId, 'items');
      const snapshot = await getDocs(itemsRef);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCartItems(items);
    };

    if (!authLoading) {
      fetchCart();
    }
  }, [authLoading, userId]);

  const updateQuantity = async (id, newQty) => {
    if (!userId || newQty < 1) return;

    const itemRef = doc(db, 'carts', userId, 'items', id);
    const itemSnap = await getDoc(itemRef);
    const itemData = itemSnap.data();

    if (newQty > itemData.stocks) {
      toast.error(`Only ${itemData.stocks} items in stock.`);
      return;
    }

    await updateDoc(itemRef, { quantity: newQty });
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  const deleteItem = async (id) => {
    if (!userId) return;
    await deleteDoc(doc(db, 'carts', userId, 'items', id));
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    if (!userId || cartItems.length === 0) return;

    // ✅ Step 1: Check stock availability
    for (const item of cartItems) {
      const productRef = doc(db, 'products', item.category, 'items', item.id);
      const productSnap = await getDoc(productRef);
      const stockAvailable = productSnap.data().stocks;

      if (item.quantity > stockAvailable) {
        toast.error(`"${item.name}" has only ${stockAvailable} in stock.`);
        return;
      }
    }

    // ✅ Step 2: Create order document with incremented order number
    const userDocRef = doc(db, 'Orders', userId);
    const userDocSnap = await getDoc(userDocRef);
    let orderNumber = 1;

    if (userDocSnap.exists()) {
      orderNumber = userDocSnap.data().lastOrder + 1;
      await updateDoc(userDocRef, { lastOrder: orderNumber });
    } else {
      await setDoc(userDocRef, { lastOrder: orderNumber });
    }

    const orderId = `order${orderNumber}`;

    // ✅ Step 3: Save each cart item to new order subcollection
    for (const item of cartItems) {
      const orderItemRef = doc(db, 'Orders', userId, orderId, item.id);
      await setDoc(orderItemRef, {
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      });

      // 🔄 Update product stock
      const productRef = doc(db, 'products', item.category, 'items', item.id);
      const productSnap = await getDoc(productRef);
      const currentStock = productSnap.data().stocks;

      await updateDoc(productRef, {
        stocks: currentStock - item.quantity,
      });
    }

    // ✅ Step 4: Save order metadata (only once)
    const orderMetaRef = doc(db, 'Orders', userId, orderId, 'meta');
    await setDoc(orderMetaRef, {
      total: total,
      createdAt: new Date(),
    });

    // ✅ Step 5: Clear cart
    for (const item of cartItems) {
      await deleteDoc(doc(db, 'carts', userId, 'items', item.id));
    }

    setCartItems([]);
    toast.success('Your Order placed successfully!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>

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
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-white bg-white/10 p-1 rounded hover:bg-white/20"
                      >
                        <FiMinus />
                      </button>
                      <span className="text-slate-300">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-white bg-white/10 p-1 rounded hover:bg-white/20"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-cyan-300 font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteItem(item.id)}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <div className="text-right space-y-2">
                <p className="text-xl font-semibold">Total:</p>
                <p className="text-2xl text-cyan-400 font-bold">
                  ${total.toFixed(2)}
                </p>
                <button
                  onClick={handleCreateOrder}
                  className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition"
                >
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