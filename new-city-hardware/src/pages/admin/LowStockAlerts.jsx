import { useEffect, useState } from 'react';
import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminSidebar from '../../components/AdminSidebar';
import electrical from '../../assets/electrical.png';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function LowStockAlerts() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

 useEffect(() => {
  const checkAdminClaim = async () => {
    const user = auth.currentUser;

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = await user.getIdTokenResult(true);

      if (!token.claims.admin) {
        navigate('/login');
      } else {
        console.log("✅ Admin verified.");
      }
    } catch (error) {
      console.error("Error checking admin claim:", error);
      navigate('/login');
    }
  };

  checkAdminClaim();
}, [navigate]);


  useEffect(() => {
    let unsubscribe = null;

    const waitForAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe = onSnapshot(
          collectionGroup(db, 'items'),
          (snapshot) => {
            const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const lowStockItems = allItems.filter(item => item.stocks <= 5);
            setItems(lowStockItems);
          },
          (error) => {
            console.error("Error fetching low stock items:", error);
          }
        );
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      waitForAuth();
    };
  }, []);

  const ignoreItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const markAsDone = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: true } : item
      )
    );
  };

  const uniqueCategories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = selectedCategory === 'All'
  ? items
  : items.filter(item => item.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-2">Low Stock Alerts</h1>
        <p className="text-sm text-gray-500 mb-6">Monitor Key Inventory Warnings</p>
        <div className="mb-4">
          <label className="text-sm font-semibold mr-2">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {Object.entries(
              filteredItems.reduce((acc, item) => {
                acc[item.category] = acc[item.category] || [];
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([categoryName, categoryItems]) => (
              <div key={categoryName} className="col-span-full">
                <h3 className="text-lg font-bold mb-2 mt-4">{categoryName}</h3>
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition
                      ${item.done ? 'bg-blue-100 opacity-80' : 'bg-gray-50 hover:shadow-md'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image || electrical} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="text-sm text-gray-600"><strong>Category:</strong> {item.category}</p>
                        <p className="text-sm text-gray-600"><strong>Item:</strong> {item.name}</p>
                        <p className="text-red-600 font-semibold text-sm">Current Stock: {item.stocks}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className={`text-sm px-4 py-2 rounded transition ${
                          item.done
                            ? 'bg-blue-500 text-white cursor-not-allowed opacity-80'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                        onClick={() => markAsDone(item.id)}
                        disabled={item.done}
                      >
                        {item.done ? 'Marked Done' : 'Mark as Done'}
                      </button>
                      <button
                        onClick={() => ignoreItem(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
                        disabled={item.done}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-2xl col-span-full text-center text-gray-400 py-8">
                All stock levels are healthy.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
