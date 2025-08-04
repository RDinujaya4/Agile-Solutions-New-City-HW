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
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Timestamp } from 'firebase/firestore';
import { useAuthState } from '../../hooks/useAuthState';
import Swal from 'sweetalert2';
import { Toast } from '../../utils/toast';

export default function Cart() {
  const { user, authLoading } = useAuthState();
  const userId = user?.uid;
  const [cartItems, setCartItems] = useState([]);
  const [editableQuantities, setEditableQuantities] = useState({});

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
      setEditableQuantities(
        Object.fromEntries(items.map((item) => [item.id, item.quantity]))
      );
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
        Toast.fire({
          icon: 'error',
          title: "Item not found in cart.",
        });
        return;
      }

      const productRef = doc(db, 'products', itemData.category, 'items', id);
      const productSnap = await getDoc(productRef);
      const stockAvailable = productSnap.data()?.stocks || 0;

      if (newQty > stockAvailable) {
        Toast.fire({
          icon: 'error',
          title: `Only ${stockAvailable} items in stock for "${itemData.name}".`,
        });
        return;
      }

      await updateDoc(itemRef, { quantity: newQty });
      setCartItems(prev =>
        prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
      );
      setEditableQuantities((prev) => ({ ...prev, [id]: newQty }));
    } catch (error) {
      console.error("Error updating quantity:", error);
      Toast.fire({
        icon: 'error',
        title: "Failed to update item quantity.",
      });
    }
  };

  const deleteItem = async (id) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, 'carts', userId, 'items', id));
      setCartItems(prev => prev.filter(item => item.id !== id));
      Toast.fire({
        icon: 'success',
        title: "Item removed from cart.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      Toast.fire({
        icon: 'error',
        title: "Failed to remove item from cart.",
      });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalDiscount = cartItems.reduce((sum, item) => {
    const discount = item.discount || 0;
    const discountAmount = (item.price * discount / 100) * item.quantity;
    return sum + discountAmount;
  }, 0);

  const finalTotal = total - totalDiscount;

  const handleCreateOrder = async () => {
    if (!userId || cartItems.length === 0) {
      Toast.fire({
        icon: 'error',
        title: "Your cart is empty.",
      });
      return;
    }
    const invalidQty = cartItems.some((item) => {
      const qty = editableQuantities[item.id];
      return !qty || parseInt(qty, 10) < 1;
    });

    if (invalidQty) {
      Toast.fire({
        icon: 'warning',
        title: "Please ensure all items have quantity of at least 1.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You can't cancel the order later!\nMake sure to double check what you order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm",
    });

    if (!result.isConfirmed) return;

    const batch = writeBatch(db);

    try {
      for (const item of cartItems) {
        const productRef = doc(db, 'products', item.category, 'items', item.id);
        const productSnap = await getDoc(productRef);
        const productData = productSnap.data();

        if (!productData || item.quantity > productData.stocks) {
          Toast.fire({
            icon: 'error',
            title: `"${item.name}" has only ${productData?.stocks || 0} in stock. Order cannot be placed.`,
          });
          return;
        }

        // batch.update(productRef, { stocks: productData.stocks - item.quantity }); this is where stock reduce if not using cloud function.
      }

      const newOrderRef = doc(collection(db, 'orders'));
      const orderId = newOrderRef.id;
      const humanReadableOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const userDetailsSnap = await getDoc(doc(db, 'users', userId));
      const userDetails = userDetailsSnap.exists() ? userDetailsSnap.data() : {};

      const orderData = {
        userId,
        orderNumber: humanReadableOrderNumber,
        total: finalTotal,
        createdAt: Timestamp.now(),
        status: 'Pending',
        progress: 'Processing',
        username: userDetails.username || 'Guest',
        email: userDetails.email || user.email || 'N/A',
      };

      batch.set(newOrderRef, orderData);

      for (const item of cartItems) {
        const orderItemRef = doc(collection(newOrderRef, 'items'), item.id);
        batch.set(orderItemRef, {
          productid: item.id,
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

      await batch.commit();

      setCartItems([]);

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
  <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-12 text-black">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-tight">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-2xl text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 w-full">

                  <div className="w-full sm:w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-lg border"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-base sm:text-lg mb-2 sm:mb-1">{item.name}</h2>

                    <div className="flex items-center gap-3 mt-1">
                      <button
                        data-cy="qty-decrease"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        <FiMinus>
                        </FiMinus>
                      </button>
                        <input
                          type="number"
                          min="0"
                          value={editableQuantities[item.id] ?? item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditableQuantities((prev) => ({ ...prev, [item.id]: value }));
                          }}
                          onBlur={async () => {
                            const inputQty = parseInt(editableQuantities[item.id], 10);

                            if (isNaN(inputQty) || inputQty < 1) {
                              Toast.fire({
                                icon: 'warning',
                                title: "Enter at least 1 item.",
                              });
                              updateQuantity(item.id, 1);
                              setEditableQuantities((prev) => ({ ...prev, [item.id]: 1 }));
                              return;
                            }

                            const productRef = doc(db, 'products', item.category, 'items', item.id);
                            const productSnap = await getDoc(productRef);
                            const stock = productSnap.data()?.stocks || 0;

                            if (inputQty > stock) {
                              Toast.fire({
                                icon: 'warning',
                                title: `Only ${stock} items in stock for "${item.name}". Quantity adjusted.`,
                              });
                              updateQuantity(item.id, stock);
                              setEditableQuantities((prev) => ({ ...prev, [item.id]: stock }));
                            } else {
                              updateQuantity(item.id, inputQty);
                              setEditableQuantities((prev) => ({ ...prev, [item.id]: inputQty }));
                            }
                          }}
                          className="w-16 border rounded px-2 py-1 text-center text-gray-900 font-medium"
                        />
                      <button
                        data-cy="qty-increase"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        <FiPlus>
                        </FiPlus>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {item.discount > 0 ? (
                      <>
                        Rs.{(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                        <span className="ml-2 text-sm line-through text-gray-400">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>Rs.{(item.price * item.quantity).toFixed(2)}</>
                    )}
                  </p>
                  <button
                    className="text-red-500 hover:text-red-600 text-sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-300 sticky top-20 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium text-gray-800">
                    {item.discount > 0 ? (
                      <>
                        Rs.{(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                        <span className="ml-1 text-xs text-gray-400 line-through">
                          Rs.{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <>Rs.{(item.price * item.quantity).toFixed(2)}</>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Subtotal</span>
                <span className="font-medium text-gray-800">Rs.{total.toFixed(2)}</span>
              </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">- Rs.{totalDiscount.toFixed(2)}</span>
            </div>

            <hr className="my-2 border-gray-300" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs.{finalTotal.toFixed(2)}</span>
            </div>
              
            </div>

            <button
              onClick={handleCreateOrder}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
            >
              Proceed to Pre Order
            </button>

          </div>
        </div>
      )}
    </div>
  </main>
);


}