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
  writeBatch, // Import writeBatch for atomic operations
} from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import { useAuthState } from '../../hooks/useAuthState';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

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

    try {
      const itemRef = doc(db, 'carts', userId, 'items', id);
      const itemSnap = await getDoc(itemRef);
      const itemData = itemSnap.data();

      if (!itemData) {
        toast.error("Item not found in cart.");
        return;
      }

      // Fetch product stock directly before updating quantity
      const productRef = doc(db, 'products', itemData.category, 'items', id);
      const productSnap = await getDoc(productRef);
      const stockAvailable = productSnap.data()?.stocks || 0;

      if (newQty > stockAvailable) {
        toast.error(`Only ${stockAvailable} items in stock for "${itemData.name}".`);
        return;
      }

      await updateDoc(itemRef, { quantity: newQty });
      setCartItems(prev =>
        prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update item quantity.");
    }
  };

  const deleteItem = async (id) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'carts', userId, 'items', id));
      setCartItems(prev => prev.filter(item => item.id !== id));
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    if (!userId || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // 🟡 Show confirm dialog first
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You can't cancel the order later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm",
    });

    // 🚫 If user cancels, exit
    if (!result.isConfirmed) return;

    const batch = writeBatch(db);

    try {
      // ✅ Step 1: Check stock availability and prepare stock updates
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.category, 'items', item.id);
        const productSnap = await getDoc(productRef);
        const productData = productSnap.data();

        if (!productData || item.quantity > productData.stocks) {
          toast.error(`"${item.name}" has only ${productData?.stocks || 0} in stock. Order cannot be placed.`);
          return;
        }

        batch.update(productRef, { stocks: productData.stocks - item.quantity });
      }

      // 🔢 Generate order ID and number
      const newOrderRef = doc(collection(db, 'orders'));
      const orderId = newOrderRef.id;
      const humanReadableOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      // ✅ Step 2: Fetch user details
      const userDetailsSnap = await getDoc(doc(db, 'users', userId));
      const userDetails = userDetailsSnap.exists() ? userDetailsSnap.data() : {};

      // ✅ Step 3: Create main order
      const orderData = {
        userId,
        orderNumber: humanReadableOrderNumber,
        total,
        createdAt: new Date(),
        status: 'Pending',
        username: userDetails.username || 'Guest',
        email: userDetails.email || user.email || 'N/A',
      };

      batch.set(newOrderRef, orderData);

      // ✅ Step 4: Add order items and delete from cart
      for (const item of cartItems) {
        const orderItemRef = doc(collection(newOrderRef, 'items'), item.id);
        batch.set(orderItemRef, {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          category: item.category,
          brand: item.brand || null,
          description: item.description || null,
        });

        const cartItemRef = doc(db, 'carts', userId, 'items', item.id);
        batch.delete(cartItemRef);
      }

      // ✅ Step 5: Commit batch
      await batch.commit();

      setCartItems([]);

      // 🟢 Show success message
      Swal.fire({
        title: `Order ${humanReadableOrderNumber} placed successfully!`,
        text: "Thank you for shopping with us.",
        icon: "success",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({
        icon: "error",
        title: `Failed to place order: ${error.message}`,
        text: "Something went wrong!",
        footer: '<a href="/contact">If you have an issue, Contact Us</a>',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-3xl text-center text-slate-200">Your cart is empty.</p>
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