import { useState, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminAddProduct() {
  const [categories, setCategories] = useState(['Tools', 'Paints', 'Electrical']);
  const [newCategory, setNewCategory] = useState('');
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    image: null,
  });

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setProduct({ ...product, category: newCategory });
      setNewCategory('');
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setProduct({ ...product, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Product:', product);
    // TODO: Send to backend or Firebase
  };

  const resetForm = () => {
    setProduct({
      name: '',
      price: '',
      quantity: '',
      description: '',
      category: '',
      image: null,
    });
    setNewCategory('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset the file input
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200 text-gray-800">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main + Preview Panel */}
      <main className="flex-1 p-10 flex gap-8">
        {/* Form Section */}
        <div className="w-2/3 bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

          {/* Category Selection */}
          <div className="mb-6">
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
              <div className="flex gap-2">
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

          {/* Product Form */}
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
              type="number"
              placeholder="Price"
              className="w-full border rounded px-3 py-2"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />

            <input
              type="text"
              placeholder="Quantity"
              className="w-full border rounded px-3 py-2"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              required
            />

            <textarea
              placeholder="Description"
              rows="3"
              className="w-full border rounded px-3 py-2"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />

            {/* Image Upload */}
            <div>
              <label className="text-sm block mb-1">Product Image</label>
              <input ref={fileInputRef} type="file" onChange={handleImageUpload} />
              {product.image && (
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-24 h-24 mt-2 rounded object-cover"
                />
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="w-1/3 bg-white shadow-md rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Live Product Preview</h2>

          {product.image ? (
            <img
              src={product.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-400 mb-4">
              Image Preview
            </div>
          )}

          <p><strong>Name:</strong> {product.name || '—'}</p>
          <p><strong>Category:</strong> {product.category || '—'}</p>
          <p><strong>Price:</strong> {product.price ? `Rs. ${product.price}` : '—'}</p>
          <p><strong>Quantity:</strong> {product.quantity || '—'}</p>
          <p className="mt-2"><strong>Description:</strong></p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{product.description || '—'}</p>
        </div>
      </main>
    </div>
  );
}
