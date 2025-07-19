import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  collectionGroup,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import toast from 'react-hot-toast';

export default function AdminCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all'); // 'all', 'pending', 'pickedup'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const metaDocs = await getDocs(collectionGroup(db, 'meta'));
        const allOrders = [];

        for (const metaDoc of metaDocs.docs) {
          const metaData = metaDoc.data();
          const [_, userId, orderId] = metaDoc.ref.path.split('/');

          // Fetch items for the order
          const itemsSnap = await getDocs(collection(db, 'Orders', userId, orderId));
          const items = itemsSnap.docs
            .filter(doc => doc.id !== 'meta')
            .map(doc => {
              const d = doc.data();
              return `${d.name} ${d.quantity}`;
            });

          allOrders.push({
            userId,
            orderId,
            orderNumber: metaData.orderNumber,
            name: metaData.username,
            email: metaData.email,
            date: metaData.createdAt?.toDate().toDateString(),
            total_value: `$${metaData.total}`,
            items,
            status: metaData.status,
          });
        }

        setOrders(allOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to fetch orders. Check your permissions or Firestore path.');
      }
    };

    fetchOrders();
  }, []);

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
    if (!window.confirm(`Confirm mark ${order.orderNumber} as picked up?`)) return;

    try {
      const metaRef = doc(db, 'Orders', order.userId, order.orderId, 'meta');
      const metaSnap = await getDoc(metaRef);

      if (metaSnap.exists()) {
        const data = metaSnap.data();
        await updateDoc(metaRef, { status: 'PickedUp' });

        await setDoc(doc(db, 'pickupOrders', order.orderId), {
          ...data,
          items: order.items,
        });

        toast.success(`Order ${order.orderNumber} marked as picked up.`);
        setOrders(prev =>
          prev.map(o => o.orderId === order.orderId ? { ...o, status: 'PickedUp' } : o)
        );
      }
    } catch (err) {
      console.error('Error picking up order:', err);
      toast.error('Failed to mark as picked up.');
    }
  };

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel ${order.orderNumber}? This will restore stock.`)) return;

    try {
      const itemDocs = await getDocs(collection(db, 'Orders', order.userId, order.orderId));

      // Restore stock
      for (const itemDoc of itemDocs.docs) {
        if (itemDoc.id === 'meta') continue;

        const item = itemDoc.data();
        const productRef = doc(db, 'products', item.category, 'items', itemDoc.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const currentStock = productSnap.data().stocks || 0;
          await updateDoc(productRef, {
            stocks: currentStock + item.quantity,
          });
        }
      }

      const metaSnap = await getDoc(doc(db, 'Orders', order.userId, order.orderId, 'meta'));
      if (metaSnap.exists()) {
        await setDoc(doc(db, 'removedOrders', order.orderId), {
          ...metaSnap.data(),
          items: order.items,
        });
      }

      // Delete the entire order
      for (const docSnap of itemDocs.docs) {
        await deleteDoc(docSnap.ref);
      }

      toast.success(`Order ${order.orderNumber} canceled and stock restored.`);
      setOrders(prev => prev.filter(o => o.orderId !== order.orderId));
    } catch (err) {
      console.error('Error canceling order:', err);
      toast.error('Failed to cancel order.');
    }
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
          {filteredOrders.map((order) => (
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
