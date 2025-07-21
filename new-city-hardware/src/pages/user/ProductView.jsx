import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { useRef } from 'react';

export default function ProductView() {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasUpdatedView = useRef(false);

  useEffect(() => {
    const fetchAndIncrementView = async () => {
      try {
        const productRef = doc(db, "products", category, "items", id);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct(productData);

          // ✅ Prevent double increment
          if (!hasUpdatedView.current) {
            hasUpdatedView.current = true; // mark before calling
            await updateDoc(productRef, {
              views: increment(1),
            });
          }
        } else {
          toast.error("Product not found.");
          navigate("/products");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchAndIncrementView();
  }, [id, category, navigate]);

  const handleBuy = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return toast.error(`Login to buy the ${product.name}.`);
    if (product.stocks <= 0) return toast.error("Out of stock.");

    const cartRef = doc(db, "carts", userId, "items", id);
    const cartSnap = await getDoc(cartRef);
    const currentQty = cartSnap.exists() ? cartSnap.data().quantity : 0;

    if (cartSnap.exists()) {
      if (currentQty >= product.stocks) {
        return toast.error(
          `You already added the max stock (${product.stocks}).`
        );
      }

      await updateDoc(cartRef, {
        quantity: currentQty + 1,
      });
      toast.success(`${product.name} quantity updated in cart.`);
    } else {
      await setDoc(cartRef, {
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stocks: product.stocks,
        category: product.category,
      });
      toast.success(`${product.name} added to cart.`);
    }
  };

  if (loading) {
    return <div className="text-center text-white p-10">Loading product...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-300 via-white-800 to-blue-900 text-white flex flex-col items-center px-4 py-10 relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-white bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition"
        >
          <FiArrowLeft /> Back to Products
        </button>
      </div>

      {/* Product Card */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 max-w-4xl w-full flex flex-col md:flex-row gap-8 mt-16">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-xl"
        />
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-slate-300">Category: {product.category}</p>
          <p className="text-sm text-slate-300">Brand: {product.brand}</p>
          <p className="text-sm text-slate-300">Description: {product.description}</p>
          <p className="text-lg font-semibold mt-2">Price: ${product.price}</p>
          <p className="text-sm text-slate-100">
            Stock: {product.stocks > 0 ? product.stocks : "Out of stock"}
          </p>

          <button
            onClick={handleBuy}
            disabled={product.stocks <= 0}
            className={`mt-4 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 ${
              product.stocks <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            <FiShoppingCart /> {product.stocks > 0 ? "Buy" : "Out of Stock"}
          </button>
        </div>
      </div>
    </main>
  );
}
