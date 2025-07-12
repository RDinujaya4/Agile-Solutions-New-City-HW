import { FiUsers, FiBox, FiLogOut, FiAlertCircle, FiList, FiPlus, FiEdit } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white border-r border-gray-300 p-6 space-y-6">
      <div className="text-center">
        <p className="font-bold">Administrator</p>
        <p className="text-xs text-gray-500">administrator@mail.com</p>
      </div>

      <nav className="space-y-2 text-sm font-medium">
        <button
          onClick={() => navigate('/admindash')}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-100 rounded-md"
        >
          <FiUsers /> Dashboard
        </button>
        <button
          onClick={() => navigate('/lowstock')}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
          <FiPlus /> Low Stock Alerts
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md">
          <FiList /> Customer Orders
        </button>
        <button
          onClick={() => navigate('/add-product')}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
          <FiPlus /> Add Item
        </button>
     <button
          onClick={() => navigate('/update-product')}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
          <FiPlus /> Update Item
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-8">
          <FiLogOut /> Log Out
        </button>
      </nav>
    </aside>
  );
}
