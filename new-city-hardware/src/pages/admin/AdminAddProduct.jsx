import { useState, useRef, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../utils/toast';

export default function AdminAddProduct() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: '',
    stocks: '',
    description: '',
    category: '',
    image: '',
    discount: 0,
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        Toast.fire({
          icon: 'error',
          title: 'You must be logged in to view this page.',
        });
        navigate('/login');
        return;
      }
      try {
        const idTokenResult = await user.getIdTokenResult(true);
        if (!idTokenResult.claims.admin) {
          Toast.fire({
            icon: 'error',
            title: "You don't have admin permissions to view this page.",
          });
          navigate('/');
        }else{
          console.log("✅ Admin verified.");
        }
      } catch (error) {
        console.error("Error checking admin claim:", error);
        Toast.fire({
          icon: 'error',
          title: 'Failed to verify admin status. Please try logging in again.',
        });
        navigate('/login');
      }
    };
    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const catList = snapshot.docs.map((doc) => doc.data().name);
      setCategories(catList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        await addDoc(collection(db, 'categories'), { name: newCategory });

        const productCategoryDoc = doc(db, 'products', newCategory);
        await setDoc(productCategoryDoc, {
          createdAt: serverTimestamp(),
          name: newCategory,
        });

        setProduct({ ...product, category: newCategory });
        setNewCategory('');
        Toast.fire({
          icon: 'success',
          title: 'Category added',
        });
      } catch (err) {
        console.error(err);
        Toast.fire({
          icon: 'error',
          title: 'Failed to add category',
        });
      }
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProduct({ ...product, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Toast.fire({
        icon: 'error',
        title: 'Please select an image',
      });
      return;
    }

    setSubmitting(true);

    const imageRef = ref(storage, `products/${uuidv4()}-${imageFile.name}`);

    try {
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const productData = {
        ...product,
        image: imageUrl,
        price: parseFloat(product.price),
        stocks: parseInt(product.stocks),
        discount: parseInt(product.discount) || 0,
        label:
          parseInt(product.stocks) === 0
            ? 'Out of Stock'
            : parseInt(product.stocks) <= 5
            ? 'Low Stock'
            : 'In Stock',
        featured: true,
        views: 0,
        createdAt: serverTimestamp(),
      };

      const categoryRef = doc(db, 'products', product.category);
      await setDoc(categoryRef, { createdAt: serverTimestamp() }, { merge: true });
      const productRef = doc(collection(categoryRef, 'items'));
      await setDoc(productRef, productData);

      Toast.fire({
        icon: 'success',
        title: 'Product added successfully',
      });

      resetForm();
    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: 'Failed to add product',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      brand: '',
      price: '',
      stocks: '',
      description: '',
      category: '',
      image: '',
      discount: 0,
    });
    setNewCategory('');
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-200 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add New Product</h1>

          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium mb-1">Select Category</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            >
              <option value="">-- Choose a Category --</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="mt-4">
              <label className="text-sm block mb-1">Or Add New Category</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., Plumbing"
                  className="border rounded px-3 py-2 flex-1"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              className="w-full border rounded px-3 py-2"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Brand Name"
              className="w-full border rounded px-3 py-2"
              value={product.brand}
              onChange={(e) => setProduct({ ...product, brand: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full border rounded px-3 py-2"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Stocks"
              className="w-full border rounded px-3 py-2"
              value={product.stocks}
              onChange={(e) => setProduct({ ...product, stocks: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Discount %"
              className="w-full border rounded px-3 py-2"
              value={product.discount}
              onChange={(e) => setProduct({ ...product, discount: e.target.value })}
            />

            <textarea
              placeholder="Description"
              rows={3}
              className="w-full border rounded px-3 py-2"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />

            <div>
              <label className="text-sm block mb-1">Product Image</label>
              <input ref={fileInputRef} type="file" onChange={handleImageUpload} />
              {product.image && (
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-24 h-24 mt-2 rounded object-contain border"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className={`px-6 py-2 rounded text-white w-full sm:w-auto ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-xl p-4 sm:p-6 h-fit">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Live Product Preview</h2>

          {product.image ? (
            <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-white rounded mb-4 overflow-hidden">
              <img
                src={product.image}
                alt="Preview"
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-400 mb-4">
              Image Preview
            </div>
          )}

          <p><strong>Name:</strong> {product.name || '—'}</p>
          <p><strong>Brand:</strong> {product.brand || '—'}</p>
          <p><strong>Category:</strong> {product.category || '—'}</p>
          <p><strong>Price:</strong> {product.price ? `Rs.${product.price}` : '—'}</p>
          <p><strong>Stocks:</strong> {product.stocks || '—'}</p>
          <p className="mt-2"><strong>Description:</strong></p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.description || '—'}</p>
        </div>
      </main>
    </div>
  );
}
