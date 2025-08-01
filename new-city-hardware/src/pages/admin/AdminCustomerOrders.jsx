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
  query,
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Toast } from '../../utils/toast';

export default function AdminCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndFetchOrders = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true);
          console.log('Admin claim:', idTokenResult.claims.admin);

          if (!idTokenResult.claims.admin) {
            Toast.fire({
              icon: 'error',
              title: "You don't have admin permissions to view this page.",
            });
            navigate('/');
            return;
          }
          await fetchOrders();
        } catch (error) {
          console.error("Error checking admin claim:", error);
          Toast.fire({
            icon: 'error',
            title: "Failed to verify admin status. Please try logging in again.",
          });
          navigate('/login');
        }
      } else {
        Toast.fire({
          icon: 'error',
          title: "You must be logged in to view this page.",
        });
        navigate('/login');
      }
    };
    checkAdminAndFetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersColSnap = await getDocs(collection(db, 'orders'));
      const pickupColSnap = await getDocs(collection(db, 'pickupOrders'));

      const allOrders = [];

      for (const orderDoc of ordersColSnap.docs) {
        const orderData = orderDoc.data();
        const orderId = orderDoc.id;
        const itemsSnap = await getDocs(collection(db, 'orders', orderId, 'items'));
        const items = itemsSnap.docs.map(doc => {
          const d = doc.data();
          return `${d.name} ${d.quantity}`;
        });

        allOrders.push({
          userId: orderData.userId,
          orderId,
          orderNumber: orderData.orderNumber,
          name: orderData.username,
          email: orderData.email,
          date: orderData.createdAt?.toDate().toDateString(),
          total_value: `Rs.${orderData.total}`,
          items,
          status: orderData.status,
          progress: orderData.progress,
        });
      }

      for (const pickupDoc of pickupColSnap.docs) {
        const orderData = pickupDoc.data();
        const orderId = pickupDoc.id;
        const itemsSnap = await getDocs(collection(db, 'pickupOrders', orderId, 'items'));
        const items = itemsSnap.docs.map(doc => {
          const d = doc.data();
          return `${d.name} ${d.quantity}`;
        });

        allOrders.push({
          userId: orderData.userId,
          orderId,
          orderNumber: orderData.orderNumber,
          name: orderData.username,
          email: orderData.email,
          date: orderData.createdAt?.toDate().toDateString(),
          total_value: `Rs.${orderData.total}`,
          items,
          status: 'PickedUp',
          progress: 'PickedUp'
        });
      }

      setOrders(allOrders);
      setFilteredOrders(allOrders);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      Toast.fire({
        icon: 'error',
        title: "Failed to fetch orders. Check console for details.",
      });
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
      const orderRef = doc(db, "orders", order.orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        Toast.fire({
          icon: 'error',
          title: "Order not found.",
        });
        return;
      }

      const dataToArchive = orderSnap.data();

      await setDoc(doc(db, "pickupOrders", order.orderId), {
        ...dataToArchive,
        status: "PickedUp",
        progress: 'PickedUp',
        pickedUpAt: new Date(),
      });

      const itemsSnap = await getDocs(collection(db, "orders", order.orderId, "items"));
      for (const itemDoc of itemsSnap.docs) {
        await setDoc(
          doc(db, "pickupOrders", order.orderId, "items", itemDoc.id),
          itemDoc.data()
        );
      }

      for (const itemDoc of itemsSnap.docs) {
        await deleteDoc(doc(db, "orders", order.orderId, "items", itemDoc.id));
      }
      await deleteDoc(orderRef);

      Toast.fire({
        icon: 'success',
        title: `Order ${order.orderNumber} marked as picked up.`,
      });
      setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
    } catch (err) {
      console.error("Error picking up order:", err);
      Toast.fire({
        icon: 'error',
        title: 'Failed to mark as picked up.',
      });
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

      for (const itemDoc of itemsSnap.docs) {
        const item = itemDoc.data();
        const productRef = doc(db, "products", item.category, "items", item.productid);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stocks || 0;
          const newStock = currentStock + item.quantity;

          let label = "In Stock";
          if (newStock <= 5 && newStock > 0) label = "Low Stock";
          else if (newStock === 0) label = "Out of Stock";

          await updateDoc(productRef, {
            stocks: newStock,
            label: label,
          });
        }
      }

      const orderRef = doc(db, "orders", order.orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const dataToArchive = orderSnap.data();

        await setDoc(doc(db, "removedOrders", order.orderId), {
          ...dataToArchive,
          status: "Removed",
          progress: 'Removed',
          canceledAt: new Date(),
        });

        for (const itemDoc of itemsSnap.docs) {
          await setDoc(
            doc(db, "removedOrders", order.orderId, "items", itemDoc.id),
            itemDoc.data()
          );
        }

        for (const itemDoc of itemsSnap.docs) {
          await deleteDoc(doc(db, "orders", order.orderId, "items", itemDoc.id));
        }
        await deleteDoc(orderRef);
      }

      Toast.fire({
        icon: 'success',
        title: `Order ${order.orderNumber} canceled and stock restored.`,
      });
      setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
    } catch (err) {
      console.error("Error canceling order:", err);
      Toast.fire({
        icon: 'error',
        title: "Failed to cancel order.",
      });
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
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse space-y-4"
              >
                <div className="h-4 w-1/3 bg-gray-300 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-3 w-1/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/4 bg-gray-300 rounded" />
                <div className="mt-3">
                  <div className="h-4 w-1/3 bg-gray-300 rounded mb-2" />
                  <div className="space-y-2">
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="w-24 h-8 bg-gray-300 rounded" />
                  <div className="w-24 h-8 bg-gray-300 rounded" />
                </div>
              </div>
            ))
          ) : filteredOrders.length > 0 ? (
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