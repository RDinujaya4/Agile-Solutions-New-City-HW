import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../firebase';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // 'all', 'pending', 'pickedup'

  useEffect(() => {
    const checkAdminClaim = async () => {
      const user = auth.currentUser;
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        console.log('Admin claim:', tokenResult.claims.admin); // 🔍 should be true
      }
    };

    checkAdminClaim();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const orderDocs = await getDocs(collectionGroup(db, 'meta'));
      const allOrders = [];

      for (const docSnap of orderDocs.docs) {
        const data = docSnap.data();
        const pathParts = docSnap.ref.path.split('/');
        const userId = pathParts[1];
        const orderId = pathParts[2];

        // Fetch item list
        const itemDocs = await getDocs(collection(db, 'Orders', userId, orderId));
        const items = itemDocs.docs
          .filter(doc => doc.id !== 'meta')
          .map(doc => {
            const d = doc.data();
            return `${d.name} ${d.quantity}`;
          });

        allOrders.push({
          userId,
          orderId,
          orderNumber: data.orderNumber,
          name: data.username,
          email: data.email,
          date: data.createdAt?.toDate().toDateString(),
          total_value: `$${data.total}`,
          items,
          status: data.status,
        });
      }

      setOrders(allOrders);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearch =
        order.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(search.toLowerCase());

      const matchesView =
        view === 'all' || (view === 'pending' && order.status === 'Pending') || (view === 'pickedup' && order.status === 'PickedUp');

      return matchesSearch && matchesView;
    });

    setFilteredOrders(filtered);
  }, [orders, search, view]);

  const handlePickUp = async (order) => {
    const metaRef = doc(db, 'Orders', order.userId, order.orderId, 'meta');
    const metaSnap = await getDoc(metaRef);
    if (!metaSnap.exists()) return;

    const data = metaSnap.data();
    await updateDoc(metaRef, { status: 'PickedUp' });

    await setDoc(doc(db, 'pickupOrders', order.orderId), {
      ...data,
      items: order.items,
    });

    toast.success(`Order ${order.orderNumber} marked as picked up.`);
    setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, status: 'PickedUp' } : o));
  };

  const handleCancel = async (order) => {
    if (!window.confirm(`Are you sure you want to cancel ${order.orderNumber}?`)) return;

    // Restore stock
    const itemDocs = await getDocs(collection(db, 'Orders', order.userId, order.orderId));
    for (const docSnap of itemDocs.docs) {
      if (docSnap.id === 'meta') continue;

      const item = docSnap.data();
      const productRef = doc(db, 'products', item.category, 'items', docSnap.id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const currentStock = productSnap.data().stocks || 0;
        await updateDoc(productRef, {
          stocks: currentStock + item.quantity,
        });
      }
    }

    // Save to removedOrders
    const metaSnap = await getDoc(doc(db, 'Orders', order.userId, order.orderId, 'meta'));
    if (metaSnap.exists()) {
      await setDoc(doc(db, 'removedOrders', order.orderId), {
        ...metaSnap.data(),
        items: order.items,
      });
    }

    // Delete order
    for (const docSnap of itemDocs.docs) {
      await deleteDoc(docSnap.ref);
    }

    toast.success(`Order ${order.orderNumber} canceled and stock restored.`);
    setOrders(prev => prev.filter(o => o.orderId !== order.orderId));
  };

  return (
    <div className="flex min-h-screen bg-gray-200 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-1">Customer Orders</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor Key Performance Of The Store</p>

        {/* Summary Card + Search */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <button onClick={() => setView('all')}>
            <div className="bg-white p-4 rounded-lg shadow-md w-60">
              <h3 className="text-md font-semibold">Total Customer Orders</h3>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toUTCString()}</p>
            </div>
          </button>
          <button onClick={() => setView('pending')}>
            <div className="bg-white p-4 rounded-lg shadow-md w-60">
              <h3 className="text-md font-semibold">Pending Orders</h3>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toUTCString()}</p>
            </div>
          </button>
          <button onClick={() => setView('pickedup')}>
            <div className="bg-white p-4 rounded-lg shadow-md w-60">
              <h3 className="text-md font-semibold">Picked Up Orders</h3>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'PickedUp').length}</p>
              <p className="text-xs text-gray-400 mt-1">Updated {new Date().toUTCString()}</p>
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <div key={order.orderId} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-2">{order.orderNumber}</h2>
              <p><strong>Customer Name:</strong> {order.name}</p>
              <p><strong>Customer Mail:</strong> {order.email}</p>
              <p><strong>Ordered Date:</strong> {order.date}</p>
              <p><strong>Total Value:</strong> {order.total_value}</p>

              <div className="mt-3">
                <strong>Ordered Items:</strong>
                <ul className="list-disc ml-5 text-red-600 font-medium mt-1">
                  {order.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
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
          ))}
          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500 py-10">No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
