import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import paints from '../assets/paints.png';

const sampleProducts = [
  {
    id: 1,
    name: 'Paints',
    image: paints,
    category: 'Tools',
    quantity: 5,
    price: 500,
    label: 'Sale',
    description: 'Best for tough works in all industries.',
  },
  {
    id: 2,
    name: 'Wrench',
    category: 'Tools',
    quantity: 10,
    price: 300,
    label: 'Deal',
    description: 'Sturdy wrench for all uses.',
    image: paints,
  },
  {
    id: 3,
    name: 'Gloves',
    category: 'Safety',
    quantity: 0,
    price: 150,
    label: 'Sold Out',
    description: 'Heavy-duty gloves for protection.',
    image: paints,
  },
];

export default function UpdateProducts() {
  const [products, setProducts] = useState(sampleProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    closeModal();
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <p className="text-sm text-gray-500 mb-8">Monitor and update inventory items easily.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded font-semibold
                  ${product.label === 'Sale' ? 'bg-blue-500' :
                    product.label === 'Deal' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {product.label}
                </span>
              </div>
              <div className="mt-3">
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setViewProduct(product)} className="bg-indigo-500 text-white px-4 py-1 rounded text-sm hover:bg-indigo-600">View</button>
                <button onClick={() => openModal(product)} className="bg-yellow-500 text-white px-4 py-1 rounded text-sm hover:bg-yellow-600">Update</button>
                <button onClick={() => setConfirmDelete(product.id)} className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600">Remove</button>
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
              <p><strong>Price:</strong> Rs. {viewProduct.price}</p>
              <p><strong>Quantity:</strong> {viewProduct.quantity}</p>
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

        {/* Tool (Name) */}
        <div>
          <label className="block text-sm font-semibold mb-1">Tool:</label>
          <input
            name="name"
            value={editingProduct.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter tool name"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-1">Category:</label>
          <input
            name="category"
            value={editingProduct.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Tools, Safety"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold mb-1">Price:</label>
          <input
            name="price"
            type="number"
            value={editingProduct.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter price"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">Quantity:</label>
          <input
            name="quantity"
            type="number"
            value={editingProduct.quantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter quantity"
          />
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm font-semibold mb-1">Label:</label>
          <input
            name="label"
            value={editingProduct.label}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Sale, Deal, Sold Out"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description:</label>
          <textarea
            name="description"
            rows={3}
            value={editingProduct.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product description"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={saveProduct}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Update
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Remove Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
              <p className="mb-6 text-lg">Are you sure you want to remove this item?</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => removeProduct(confirmDelete)} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">Yes</button>
                <button onClick={() => setConfirmDelete(null)} className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500">No</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
