import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);

        const itemsRef = collection(db, 'carts', user.uid, 'items');

        const unsubscribeCart = onSnapshot(itemsRef, (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartItems(items);
        });

        return () => unsubscribeCart(); // clean up Firestore listener
      } else {
        setUserId(null);
        setCartItems([]);
      }
    });

    return () => unsubscribeAuth(); // clean up auth listener
  }, []);

  return (
    <CartContext.Provider value={{ cartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
