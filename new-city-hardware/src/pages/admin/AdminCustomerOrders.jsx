import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  query, // Make sure query is imported
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AdminCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          console.log('Admin claim:', idTokenResult.claims.admin);

          if (!idTokenResult.claims.admin) {
            toast.error("You don't have admin permissions to view this page.");
            navigate('/');
            return;
          }
          await fetchOrders();
        } catch (error) {
          console.error("Error checking admin claim:", error);
          toast.error("Failed to verify admin status. Please try logging in again.");
          navigate('/login');
        }
      } else {
        toast.error("You must be logged in to view this page.");
        navigate('/login');
      }
    };
    checkAdminAndFetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      // Fetch all order documents from the top-level 'orders' collection
      // No collectionGroup needed anymore!
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const allOrders = [];

      for (const orderDoc of ordersSnap.docs) {
        const orderData = orderDoc.data();
        const orderId = orderDoc.id; // The order ID is now the document ID

        // Fetch items for this specific order from its subcollection
        const itemsSnap = await getDocs(collection(db, 'orders', orderId, 'items'));
        const items = itemsSnap.docs.map(doc => {
          const d = doc.data();
          return `${d.name} ${d.quantity}`;
        });

        allOrders.push({
          userId: orderData.userId, // Now explicitly stored
          orderId: orderId,
          orderNumber: orderData.orderNumber,
          name: orderData.username,
          email: orderData.email,
          date: orderData.createdAt?.toDate().toDateString(),
          total_value: `$${orderData.total}`,
          items: items,
          status: orderData.status,
        });
      }

      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Check Firestore rules and admin claim.');
      } else if (error.code === 'unavailable') {
        toast.error('Firestore is temporarily unavailable. Check network connection.');
      } else if (error.code === 'failed-precondition' && error.message.includes('index')) {
        toast.error('Missing Firestore index. Check Firebase console for index suggestions.');
      } else {
        toast.error(`Failed to fetch orders: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchSearch =
        order.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(search.toLowerCase());

      const matchView =
        view === 'all' ||
        (view === 'pending' && order.status === 'Pending') ||
        (view === 'pickedup' && order.status === 'PickedUp');

      return matchSearch && matchView;
    });

    setFilteredOrders(filtered);
  }, [orders, search, view]);

  const handlePickUp = async (order) => {
    const result = await Swal.fire({
      title: `Mark ${order.orderNumber} as picked up?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as picked up",
    });

    if (!result.isConfirmed) return;

    try {
      const orderRef = doc(db, 'orders', order.orderId); // Direct reference to the order document
      await updateDoc(orderRef, { status: 'PickedUp' }); // Update status directly on the order document

      // Archive to pickupOrders collection
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        const dataToArchive = orderSnap.data();
        await setDoc(doc(db, 'pickupOrders', order.orderId), {
          ...dataToArchive,
          items: order.items,
          pickedUpAt: new Date(),
        });
      }

      toast.success(`Order ${order.orderNumber} marked as picked up.`);
      setOrders(prev =>
        prev.map(o => o.orderId === order.orderId ? { ...o, status: 'PickedUp' } : o)
      );
    } catch (err) {
      console.error('Error picking up order:', err);
      toast.error('Failed to mark as picked up. Check permissions for "pickupOrders" and "orders".');
    }
  };

  const handleCancel = async (order) => {
    const result = await Swal.fire({
      title: `Cancel ${order.orderNumber}?`,
      text: "This will restore the product stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
    });

    if (!result.isConfirmed) return;

    try {
      const itemsSnap = await getDocs(collection(db, "orders", order.orderId, "items"));

      // Restore stock and update label
      for (const itemDoc of itemsSnap.docs) {
        const item = itemDoc.data();
        const productRef = doc(db, "products", item.category, "items", item.productid);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stocks || 0;
          const newStock = currentStock + item.quantity;

          // Label logic
          let label = "In Stock";
          if (newStock <= 5 && newStock > 0) {
            label = "Low Stock";
          } else if (newStock === 0) {
            label = "Out of Stock";
          }

          await updateDoc(productRef, {
            stocks: newStock,
            label: label,
          });
        }
      }

      // Archive to removedOrders
      const orderRef = doc(db, "orders", order.orderId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        const dataToArchive = orderSnap.data();
        await setDoc(doc(db, "removedOrders", order.orderId), {
          ...dataToArchive,
          items: order.items,
          status: "Removed",
          canceledAt: new Date(),
        });
      }

      // Delete order doc
      await deleteDoc(orderRef);

      toast.success(`Order ${order.orderNumber} canceled, stock restored, label updated.`);
      setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error("Failed to cancel order. Check permissions for 'products' and 'removedOrders'.");
    }
};

  return (
    <div className="flex min-h-screen bg-gray-200 text-gray-800">
      <AdminSidebar />
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-1">Customer Orders</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor Key Performance Of The Store</p>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <button onClick={() => setView('all')}>
            <div className={`bg-white p-4 rounded-lg shadow-md w-60 ${view === 'all' ? 'border-2 border-blue-500' : ''}`}>
              <h3 className="text-md font-semibold">Total Customer Orders</h3>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toLocaleString()}</p>
            </div>
          </button>
          <button onClick={() => setView('pending')}>
            <div className={`bg-white p-4 rounded-lg shadow-md w-60 ${view === 'pending' ? 'border-2 border-blue-500' : ''}`}>
              <h3 className="text-md font-semibold">Pending Orders</h3>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toLocaleString()}</p>
            </div>
          </button>
          <button onClick={() => setView('pickedup')}>
            <div className={`bg-white p-4 rounded-lg shadow-md w-60 ${view === 'pickedup' ? 'border-2 border-blue-500' : ''}`}>
              <h3 className="text-md font-semibold">Picked Up Orders</h3>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'PickedUp').length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toLocaleString()}</p>
            </div>
          </button>
          <input
            type="text"
            placeholder="Search customer, email or order no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded border w-72"
          />
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold mb-2">Order No: {order.orderNumber}</h2>
                <p><strong>Customer Name:</strong> {order.name}</p>
                <p><strong>Customer Mail:</strong> {order.email}</p>
                <p><strong>Ordered Date:</strong> {order.date}</p>
                <p><strong>Total Value:</strong> {order.total_value}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${order.status === 'Pending' ? 'text-orange-500' : 'text-green-600'}`}>{order.status}</span></p>

                <div className="mt-3">
                  <strong>Ordered Items:</strong>
                  <ul className="list-disc ml-5 text-red-600 font-medium mt-1">
                    {order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>No items found for this order.</li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handlePickUp(order)}
                    className={`text-white text-sm px-5 py-2 rounded ${
                      order.status === 'PickedUp'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={order.status === 'PickedUp'}
                  >
                    {order.status === 'PickedUp' ? 'Picked Up' : 'Pick Up'}
                  </button>
                  <button
                    onClick={() => handleCancel(order)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
}