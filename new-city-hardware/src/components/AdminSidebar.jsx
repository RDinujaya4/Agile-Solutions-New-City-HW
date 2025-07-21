import {
  FiUsers,
  FiLogOut,
  FiAlertCircle,
  FiList,
  FiPlus,
  FiEdit,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import defaultProfile from '../assets/admin-image.png';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setAdminEmail(user.email);
    }
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
    });

    if (result.isConfirmed) {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: <FiUsers />, label: 'Dashboard', path: '/admindash' },
    { icon: <FiAlertCircle />, label: 'Low Stock Alerts', path: '/lowstock' },
    { icon: <FiList />, label: 'Pre Order Items', path: '/PreOrder' },
    { icon: <FiPlus />, label: 'Add Item', path: '/add-product' },
    { icon: <FiEdit />, label: 'Update Item', path: '/update-product' },
  ];

  const navigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Sidebar"
          className="text-gray-800 bg-white p-2 rounded-md shadow border"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Mobile Overlay Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-full bg-white p-6 z-50 border-r shadow transition-transform">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={defaultProfile}
                  alt="Admin"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <p className="font-bold">Admin</p>
                  <p className="text-xs text-gray-500 max-w-[8rem] truncate">{adminEmail}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
                <FiX size={22} />
              </button>
            </div>
            <nav className="space-y-2 text-sm">
              {menuItems.map(({ label, icon, path }) => (
                <button
                  key={label}
                  onClick={() => navigateAndClose(path)}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
                >
                  {icon} {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-6"
              >
                <FiLogOut /> Log Out
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-300 p-6 space-y-6 min-h-screen">
        <div className="flex items-center gap-3">
          <img
            src={defaultProfile}
            alt="Admin"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-bold">Administrator</p>
            <p className="text-xs text-gray-500 max-w-[12rem] truncate">{adminEmail}</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm font-medium mt-4">
          {menuItems.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md text-left"
            >
              {icon} {label}
            </button>
          ))}
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md mt-8"
            onClick={handleLogout}
          >
            <FiLogOut /> Log Out
          </button>
        </nav>
      </aside>
    </>
  );
}
