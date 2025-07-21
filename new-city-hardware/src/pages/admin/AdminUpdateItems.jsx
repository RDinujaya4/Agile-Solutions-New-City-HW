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
import Swal from 'sweetalert2';

export default function AdminUpdateProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔁 Fetch all products
  const fetchAllProducts = async () => {
    let all = [];
    const catsSnapshot = await getDocs(collection(db, 'products'));
    for (const cat of catsSnapshot.docs) {
      const itemsRef = collection(db, 'products', cat.id, 'items');
      const itemsSnapshot = await getDocs(itemsRef);
      itemsSnapshot.forEach(docSnap => {
        all.push({ id: docSnap.id, ...docSnap.data(), category: cat.id });
      });
    }
    setProducts(all);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // 🔁 Real-time categories
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

    // Dynamically set label
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
        description,
        category,
        image,
        label,
        views: finalViews,
        featured: finalFeatured,
        createdAt: finalCreatedAt,
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
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchAllProducts();
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded font-semibold
                  ${product.label === 'Low Stock' ? 'bg-yellow-500' :
                    product.label === 'In Stock' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {product.label}
                </span>
              </div>
              <p className="mt-2 font-semibold">{product.name}</p>
              <p className="text-sm">Stock: {product.stocks}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setViewProduct(product)} className="bg-indigo-500 text-white px-4 py-1 rounded text-sm hover:bg-indigo-600">View</button>
                <button onClick={() => openModal(product)} className="bg-yellow-500 text-white px-4 py-1 rounded text-sm hover:bg-yellow-600">Update</button>
                <button onClick={() => removeProduct(product)} className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* View Modal */}
        {viewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-48 object-cover rounded mb-4" />
              <p><strong>Name:</strong> {viewProduct.name}</p>
              <p><strong>Category:</strong> {viewProduct.category}</p>
              <p><strong>Price:</strong> ${viewProduct.price}</p>
              <p><strong>Stocks:</strong> {viewProduct.stocks}</p>
              <p><strong>Brand:</strong> {viewProduct.brand}</p>
              <p><strong>Label:</strong> {viewProduct.label}</p>
              <p className="mt-2"><strong>Description:</strong> {viewProduct.description}</p>
              <button onClick={() => setViewProduct(null)} className="mt-6 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Close</button>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {modalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-300 p-8 rounded-xl shadow-2xl w-full max-w-xl relative">
              <h2 className="text-xl font-bold mb-6 text-center">Update Product</h2>
              <div className="space-y-4">
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
                <label>Brand</label>
                <input className="w-full border rounded px-3 py-2" name="brand" value={editingProduct.brand} onChange={handleChange} placeholder="Brand" />
                <label>Description</label>
                <textarea className="w-full border rounded px-3 py-2" name="description" rows={3} value={editingProduct.description} onChange={handleChange} placeholder="Description" />
                <div className="flex justify-end gap-4 pt-4">
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
