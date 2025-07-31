import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { db } from '../../firebase';
import AdminSidebar from '../../components/AdminSidebar';
import { getMonth, getDate, parseISO } from 'date-fns';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Timestamp, query, where } from 'firebase/firestore';

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [monthlyVisitors, setMonthlyVisitors] = useState([]);
  const [dailyVisitors, setDailyVisitors] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
          navigate('/');
        }else{
          console.log("✅ Admin verified.");
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

  const generateSalesReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); // include the whole end day

    try {
      const pickupRef = collection(db, "pickupOrders");
      const q = query(pickupRef,
        where("pickedUpAt", ">=", Timestamp.fromDate(start)),
        where("pickedUpAt", "<=", Timestamp.fromDate(end))
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        toast("No picked up orders in this date range.");
        return;
      }

      const rows = [];
      let totalSales = 0;

      snap.forEach(doc => {
        const data = doc.data();
        totalSales += data.total;

        rows.push({
          OrderNumber: data.orderNumber,
          Username: data.username,
          Email: data.email,
          Total: data.total,
          PickedUpAt: data.pickedUpAt.toDate().toLocaleString(),
        });
      });

      // Add total summary row
      rows.push({
        OrderNumber: "",
        Username: "",
        Email: "Total",
        Total: totalSales,
        PickedUpAt: "",
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SalesReport");

      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      saveAs(blob, `Sales_Report_${startDate}_to_${endDate}.xlsx`);
      toast.success("Excel report downloaded.");
    } catch (error) {
      console.error("Error generating sales report:", error);
      toast.error("Failed to generate report. Check Firestore rules or date format.");
    }
  };

 const handleExportSalesReport = async () => {
  if (!startDate || !endDate) {
    toast.error('Please select both start and end dates');
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // include full end day

  try {
    const snapshot = await getDocs(collection(db, 'pickupOrders'));
    const rows = [];
    let grandTotal = 0;

    for (const docSnap of snapshot.docs) {
      const orderData = docSnap.data();
      const orderDate = orderData.createdAt?.toDate?.();

      if (!orderDate || orderDate < start || orderDate > end) continue;

      const orderId = docSnap.id;
      const orderNumber = orderData.orderNumber || 'N/A';
      const username = orderData.username || '';
      const email = orderData.email || '';
      const pickedUpAt = orderData.pickedUpAt?.toDate?.().toLocaleString() || '';
      const orderTotal = orderData.total || 0;
      grandTotal += orderTotal;

      // Fetch items subcollection
      const itemsSnap = await getDocs(collection(db, 'pickupOrders', orderId, 'items'));

      for (const itemDoc of itemsSnap.docs) {
        const item = itemDoc.data();

        rows.push({
          OrderNumber: orderNumber,
          Username: username,
          Email: email,
          PickedUpAt: pickedUpAt,
          ItemName: item.name || '',
          Quantity: item.quantity || 0,
          Price: item.price || 0,
          ItemTotal: (item.quantity || 0) * (item.price || 0),
        });
      }

      // Add order total row
      rows.push({
        OrderNumber: orderNumber,
        Username: '',
        Email: '',
        PickedUpAt: '',
        ItemName: 'Order Total',
        Quantity: '',
        Price: '',
        ItemTotal: orderTotal,
      });
    }

    // Final Grand Total Row
    rows.push({
      OrderNumber: '',
      Username: '',
      Email: '',
      PickedUpAt: '',
      ItemName: 'Grand Total',
      Quantity: '',
      Price: '',
      ItemTotal: grandTotal,
    });

    // Generate Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detailed Sales Report');

    const blob = new Blob([XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })], {
      type: 'application/octet-stream',
    });

    saveAs(blob, `Detailed_Sales_Report_${startDate}_to_${endDate}.xlsx`);
  } catch (error) {
    console.error("Error exporting sales report:", error);
    toast.error("Failed to export sales report.");
  }
};

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
        <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" className="border rounded px-3 py-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" className="border rounded px-3 py-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={generateSalesReport}
          >
            Print Sales Report
          </button>
          <button
            onClick={handleExportSalesReport}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export Detailed Sales Report
          </button>
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

      <aside className="w-full lg:w-80 bg-gray-200 p-4 sm:p-6 space-y-4 rounded-t-xl lg:rounded-l-xl overflow-y-auto">
        <h3 className="text-lg font-semibold">Most Viewed Products</h3>
        {mostViewedProducts.map((product, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-3 flex items-center gap-3 shadow"
          >
            <div className="min-w-[4rem] w-18 h-18 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="text-sm overflow-hidden">
              <p className="truncate"><strong>Category:</strong> {product.category}</p>
              <p className="truncate"><strong>Item:</strong> {product.name}</p>
              <p><strong>Views:</strong> {product.views}</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}