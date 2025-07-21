import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore'; // getDoc is used here
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { db } from '../../firebase';
import AdminSidebar from '../../components/AdminSidebar';
import { getMonth, getDate, parseISO } from 'date-fns';
import { auth } from '../../firebase'; // Import auth for admin check
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import toast from 'react-hot-toast'; // Import toast for user feedback

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [monthlyVisitors, setMonthlyVisitors] = useState([]);
  const [dailyVisitors, setDailyVisitors] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Admin Check on Mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to view this page.");
        navigate('/login');
        return;
      }
      try {
        const idTokenResult = await user.getIdTokenResult(true);
        if (!idTokenResult.claims.admin) {
          toast.error("You don't have admin permissions to view this page.");
          navigate('/'); // Redirect to home or another non-admin page
        }
      } catch (error) {
        console.error("Error checking admin claim:", error);
        toast.error("Failed to verify admin status. Please try logging in again.");
        navigate('/login');
      }
    };
    checkAdminStatus();
  }, [navigate]); // Dependency array includes navigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        setTotalUsers(snap.size);
      } catch (error) {
        console.error("Error fetching total users:", error);
        // Do not show toast here as it might be a permission issue for non-admin on refresh
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        setTotalOrders(snap.size);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchViews = async () => {
      let products = [];
      try {
        const categoriesSnap = await getDocs(collection(db, 'products'));

        for (const categoryDoc of categoriesSnap.docs) {
          const catName = categoryDoc.id;
          const itemsSnap = await getDocs(collection(db, 'products', catName, 'items'));

          itemsSnap.forEach(docSnap => {
            const data = docSnap.data();
            // Ensure data.views exists and is a number
            if (typeof data.views === 'number') {
              products.push({ ...data, id: docSnap.id, category: catName });
            }
          });
        }

        products.sort((a, b) => b.views - a.views);
        setMostViewedProducts(products.slice(0, 5));
      } catch (error) {
        console.error("Error fetching most viewed products:", error);
      }
    };
    fetchViews();
  }, []);

  useEffect(() => {
    // Corrected fetchVisitorStats to read from 'siteStats/visitors'
    const fetchVisitorStats = async () => {
      try {
        const visitorDocRef = doc(db, 'siteStats', 'visitors'); // Correct path
        const snap = await getDoc(visitorDocRef); // Use getDoc for single document

        const monthly = Array(12).fill(0);
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const dailyMap = {};

        if (snap.exists()) {
          const data = snap.data();

          // Populate monthly visitors
          if (data.monthly) {
            for (let m = 0; m < 12; m++) {
              // Construct month string 'yyyy-MM'
              const monthKey = `${currentYear}-${(m + 1).toString().padStart(2, '0')}`;
              monthly[m] = data.monthly[monthKey] || 0;
            }
          }
          setMonthlyVisitors(monthly);

          // Populate daily visitors for current month
          if (data.daily) {
            for (const dayKey in data.daily) {
              const dateObj = parseISO(dayKey); // 'yyyy-MM-dd'
              if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
                const d = getDate(dateObj);
                dailyMap[d] = (dailyMap[d] || 0) + data.daily[dayKey];
              }
            }
          }

          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
          const dailyArray = Array(daysInMonth).fill(0);
          for (let i = 1; i <= daysInMonth; i++) {
            dailyArray[i - 1] = dailyMap[i] || 0;
          }
          setDailyVisitors(dailyArray);

        } else {
          // If no visitor data exists yet
          setMonthlyVisitors(Array(12).fill(0));
          setDailyVisitors(Array(new Date(currentYear, currentMonth + 1, 0).getDate()).fill(0));
        }

      } catch (error) {
        console.error("Error fetching visitor stats:", error);
        toast.error("Failed to fetch visitor statistics. Check permissions.");
      }
    };

    fetchVisitorStats();
  }, []); // Re-run if current month/year changes

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // ... rest of your component (return statement)
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Registered Users</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p className="text-xs text-gray-400 mt-1">Updated {new Date().toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Customer Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <p className="text-xs text-gray-400 mt-1">Updated {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Visitors</h2>
          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: 'Visitors',
                  data: monthlyVisitors,
                  borderColor: '#3B82F6',
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Visitors (Current Month)</h2>
          <Bar
            data={{
              labels: dailyVisitors.map((_, i) => `Day ${i + 1}`),
              datasets: [
                {
                  label: 'Visitors',
                  data: dailyVisitors,
                  backgroundColor: '#10B981',
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </main>

      <aside className="w-80 bg-gray-200 p-6 space-y-4 rounded-l-xl overflow-y-auto">
        <h3 className="text-lg font-semibold">Most Viewed Products</h3>
        {mostViewedProducts.map((product, index) => (
          <div key={index} className="bg-white rounded-lg p-3 flex gap-3 items-center shadow">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
            <div className="text-sm">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Item:</strong> {product.name}</p>
              <p><strong>Views:</strong> {product.views}</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}