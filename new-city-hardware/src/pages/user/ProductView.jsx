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
  <main className="min-h-screen bg-white text-black px-4 py-10 flex flex-col items-center relative">
    {/* Back Button */}
    <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black"
      >
        <FiArrowLeft /> Back to Products
      </button>
    </div>

    {/* Product Section */}
    <div className="w-full max-w-6xl mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Image Section */}
      <div className="flex flex-col items-center">
        <div className="w-full h-96 overflow-hidden rounded-2xl border">
         <img
              src={product.image}
              alt={product.name}
              className="object-contain max-h-90 mx-auto"
            />
        </div>
      </div>

      {/* Right Details Section */}
      <div className="flex flex-col gap-6 justify-between">
        <div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">Rs. {product.price}</p>
          

          <button
            onClick={handleBuy}
            disabled={product.stocks <= 0}
            className={`w-full py-3 rounded-full font-medium text-white transition ${
              product.stocks <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {product.stocks > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>

        {/* Accordion-like Sections */}
        <div className="border-t pt-4">
          <h2 className="font-semibold text-md mb-2">Description & Fit</h2>
          <p className="text-sm text-gray-600">
            {
              product.description
            }
          </p>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold text-md mb-2">Shipping</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {/* <li>Discount: <span className="font-medium text-black">Disc 50%</span></li> */}
            <li>Package: <span className="font-medium text-black">Regular Package</span></li>
            <li>Est. Arrival: <span className="font-medium text-black">Please come within 7 days after pre-order your product.</span></li>
          </ul>
        </div>
      </div>
    </div>
  </main>
);


}
