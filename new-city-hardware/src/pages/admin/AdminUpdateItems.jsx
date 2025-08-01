import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import { auth } from '../../firebase';
import { Toast } from '../../utils/toast';

export default function AdminUpdateProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        Toast.fire({
          icon: 'error',
          title: "You must be logged in to view this page.",
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
          title: "Failed to verify admin status. Please try logging in again.",
        });
        navigate('/login');
      }
    };
    checkAdminStatus();
  }, [navigate]);

  const fetchAllProducts = async () => {
    setLoading(true);
    let all = [];
    const catsSnapshot = await getDocs(collection(db, 'products'));
    for (const cat of catsSnapshot.docs) {
      const itemsRef = collection(db, 'products', cat.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      itemsSnapshot.forEach(docSnap => {
        all.push({ id: docSnap.id, ...docSnap.data(), category: cat.id });
      });
    }
    setLoading(false);
    setProducts(all);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setCategories(snap.docs.map(d => d.data().name));
    });
    return () => unsub();
  }, []);

  const openModal = (product) => {
    setEditingProduct({ ...product, oldCategory: product.category });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    const {
      id,
      name,
      brand,
      price,
      stocks,
      description,
      category,
      image,
      oldCategory,
      views,
      featured,
      createdAt,
    } = editingProduct;

    const finalViews = views ?? 0;
    const finalFeatured = featured ?? true;
    const finalCreatedAt = createdAt ?? new Date();

    const stockCount = parseInt(stocks);
    let label = 'In Stock';
    if (stockCount === 0) label = 'Out of Stock';
    else if (stockCount < 5) label = 'Low Stock';

    const oldRef = doc(db, 'products', oldCategory || category, 'items', id);
    const newRef = doc(db, 'products', category, 'items', id);

    try {
      if (oldCategory !== category) {
        await deleteDoc(oldRef);
      }

      await setDoc(newRef, {
        name,
        brand,
        price: parseFloat(price),
        stocks: stockCount,
        discount: parseInt(editingProduct.discount) || 0,
        description,
        category,
        image,
        label,
        views: finalViews,
        featured: finalFeatured,
        createdAt: finalCreatedAt,
      });

      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id ? { ...editingProduct } : p
        )
      );

      Toast.fire({
        icon: 'success',
        title: "Product updated successfully.",
      });
      closeModal();
      fetchAllProducts();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const removeProduct = async (product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'products', product.category, 'items', product.id));
        const imageRef = ref(storage, product.image);
        deleteObject(imageRef).catch(() => {
          console.warn('Image not found or already deleted.');
        });
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchAllProducts();
      }
    });
  };

  const filteredProducts = selectedCategory
  ? products.filter(p => p.category === selectedCategory)
  : products;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-10">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="mb-6">
          <select
            className="w-full md:w-60 px-4 py-2 rounded border"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse space-y-3">
                <div className="w-full h-40 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2 mt-4">
                  <div className="w-full h-8 bg-gray-300 rounded" />
                  <div className="w-full h-8 bg-gray-300 rounded" />
                  <div className="w-full h-8 bg-gray-300 rounded" />
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between"
              >

                <div className="relative">
                  <div className="w-full h-40 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <span
                    className={`absolute top-1 right-1 px-2 py-1 text-[11px] sm:text-xs rounded font-semibold text-white ${
                      product.label === 'Low Stock'
                        ? 'bg-yellow-500'
                        : product.label === 'In Stock'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {product.label}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="font-semibold text-sm sm:text-base line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Stock: {product.stocks}</p>
                </div>

                <div className="mt-4 flex flex-wrap justify-between gap-2">
                  <button
                    onClick={() => setViewProduct(product)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600 flex-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openModal(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 flex-1"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => removeProduct(product)}
                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {viewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Product Details</h2>

              <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-white rounded mb-4 overflow-hidden">
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="space-y-1 text-sm sm:text-base">
                <p><strong>Name:</strong> {viewProduct.name}</p>
                <p><strong>Category:</strong> {viewProduct.category}</p>
                <p><strong>Price:</strong> Rs. {viewProduct.price}</p>
                <p><strong>Stocks:</strong> {viewProduct.stocks}</p>
                <p><strong>Brand:</strong> {viewProduct.brand}</p>
                <p><strong>Label:</strong> {viewProduct.label}</p>
                <p className="mt-2"><strong>Description:</strong> {viewProduct.description}</p>
              </div>

              <button
                onClick={() => setViewProduct(null)}
                className="mt-6 w-full bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {modalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-300 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-xl relative">
              <h2 className="text-xl font-bold mb-6 text-center">Update Product</h2>
              <div className="space-y-3">
                <label>Name</label>
                <input className="w-full border rounded px-3 py-2" name="name" value={editingProduct.name} onChange={handleChange} placeholder="Name" />

                <label>Category</label>
                <select className="w-full border rounded px-3 py-2" name="category" value={editingProduct.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </select>

                <label>Price</label>
                <input className="w-full border rounded px-3 py-2" name="price" type="number" value={editingProduct.price} onChange={handleChange} placeholder="Price" />

                <label>Stocks</label>
                <input className="w-full border rounded px-3 py-2" name="stocks" type="number" value={editingProduct.stocks} onChange={handleChange} placeholder="Stocks" />

                <label>Discount (%)</label>
                <input className="w-full border rounded px-3 py-2" name="discount" type="number" value={editingProduct.discount || 0} onChange={handleChange} placeholder="e.g. 10" />

                <label>Brand</label>
                <input className="w-full border rounded px-3 py-2" name="brand" value={editingProduct.brand} onChange={handleChange} placeholder="Brand" />

                <label>Description</label>
                <textarea className="w-full border rounded px-3 py-2" name="description" rows={3} value={editingProduct.description} onChange={handleChange} placeholder="Description" />

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                  <button onClick={saveProduct} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Update</button>
                  <button onClick={closeModal} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
