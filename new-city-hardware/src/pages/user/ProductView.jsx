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
import { FiBox } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi";


export default function ProductView() {
  const { id, category } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasUpdatedView = useRef(false);

  useEffect(() => {
    const fetchAndIncrementView = async () => {
      setLoading(true);
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
        discount: product.discount || 0,
        image: product.image,
        quantity: 1,
        stocks: product.stocks,
        category: product.category,
      });
      toast.success(`${product.name} added to cart.`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black px-4 py-10 flex flex-col items-center relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black">
            <FiArrowLeft /> Back to Products
          </button>
        </div>

        {/* Skeleton Layout */}
        <div className="w-full max-w-6xl mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          {/* Image Placeholder */}
          <div className="flex justify-center">
            <div className="w-full h-96 bg-gray-200 rounded-2xl"></div>
          </div>

          {/* Right Placeholder Text */}
          <div className="flex flex-col gap-6 justify-between">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded w-full"></div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </main>
    );
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
          <div className="relative w-full h-96 flex items-center justify-center">
            
            {/* Left vertical line */}
            <div className="absolute left-0 top-0 bottom-0 flex justify-center">
              <div className="w-[3px] h-[140%] bg-gray-300 translate-y-[-0%]"></div>
            </div>

            {/* Right vertical line */}
            <div className="absolute right-0 top-0 bottom-0 flex justify-center">
              <div className="w-[3px] h-[140%] bg-gray-300 translate-y-[-0%]"></div>
            </div>

            {/* Image Box */}
            <div className="w-full h-full overflow-hidden rounded-2xl z-10 relative">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain w-full h-full"
              />

              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="flex flex-col gap-6 justify-between">
          <div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.discount > 0 ? (
              <p className="text-xl font-semibold mb-4 text-red-600">
                Rs. {(product.price * (1 - product.discount / 100)).toFixed(2)}
                <span className="text-gray-500 line-through ml-2 text-base">
                  Rs. {product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              </p>
            ) : (
              <p className="text-xl font-semibold mb-4">Rs. {product.price}</p>
            )}

            <button
              onClick={handleBuy}
              disabled={product.stocks <= 0}
              className={`w-full py-3 rounded-full font-medium text-white transition flex items-center justify-center gap-2 ${
                product.stocks <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {product.stocks > 0 ? (
                <>
                  <FiShoppingCart className="text-lg" />
                  Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
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
            <div className="flex items-center gap-2 mb-2 relative group">
              <h2 className="font-semibold text-md flex items-center gap-1">
                <FiBox /> Stocks:
              </h2>
              <p
                className={`text-sm font-bold ${
                  product.stocks <= 5 ? "text-red-500" : "text-gray-800"
                }`}
              >
                {product.stocks}
              </p>

              {product.stocks <= 5 && (
                <div className="absolute left-0 top-full mt-1 bg-black text-white text-xs px-2 py-1 rounded shadow-lg hidden group-hover:flex items-center gap-1 z-10">
                  <FiAlertCircle className="text-yellow-400" /> Hurry! Only a few left.
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold text-md mb-2">Pickup</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {/* <li>Discount: <span className="font-medium text-black">Disc 50%</span></li> */}
              <li>Package: <span className="font-medium text-black">Regular Package</span></li>
              <li>Est. Pickup: <span className="font-medium text-black">Please come within 7 days after pre-order your product</span></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
