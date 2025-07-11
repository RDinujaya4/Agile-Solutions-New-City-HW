import { FiUsers, FiBox, FiLogOut, FiAlertCircle, FiList, FiPlus, FiEdit } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import drillImg from '../assets/Drill.png';
import logo from '../assets/Logo.png';

const visitorsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Visitors',
      data: [200, 400, 650, 300, 700, 350, 500, 800, 700, 600, 550, 500],
      fill: false,
      borderColor: '#3B82F6',
      tension: 0.3,
    },
  ],
};

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-200 text-gray-800">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-300 p-6 space-y-6">
        <div className="text-center">
        
          <p className="font-bold">Administrator</p>
          <p className="text-xs text-gray-500">administrator@mail.com</p>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md">
            <FiUsers /> Dashboard
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
            <FiAlertCircle /> Low Stock Alerts
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
            <FiList /> Customer Orders
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
            <FiPlus /> Add Item
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
            <FiEdit /> Update Item
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-8">
            <FiLogOut /> Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Print Sales</button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Registered Users</p>
            <p className="text-2xl font-bold">1500</p>
            <p className="text-xs text-gray-400 mt-2">Last Updated On Feb 3, 4:09:57 AM UTC</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Customer Orders</p>
            <p className="text-2xl font-bold">20</p>
            <p className="text-xs text-gray-400 mt-2">Last Updated On Feb 3, 4:09:57 AM UTC</p>
          </div>
        </div>

        {/* Visitors Graph */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Total Visitors</h2>
          <Line data={visitorsData} />
        </div>
      </main>

      {/* Most Viewed Products */}
      <aside className="w-80 bg-gray-300 p-6 space-y-4 rounded-l-xl">
        <h3 className="text-lg font-semibold">Most View Products</h3>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 flex gap-3 items-center shadow">
            <img src={drillImg} alt="Drill" className="w-16 h-16 object-cover rounded" />
            <div className="text-sm">
              <p><strong>Category:</strong> Tools</p>
              <p><strong>Item Name:</strong> Drill</p>
              <p><strong>Views:</strong> 156</p>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default AdminDashboard;
