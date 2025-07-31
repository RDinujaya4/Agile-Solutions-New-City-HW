import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { FiBox, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pickupOrders, setPickupOrders] = useState([]);
  const [removedOrders, setRemovedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const [pending, pickedUp, removed] = await Promise.all([
        getUserOrders("orders"),
        getUserOrders("pickupOrders"),
        getUserOrders("removedOrders"),
      ]);

      setOrders(pending);
      setPickupOrders(pickedUp);
      setRemovedOrders(removed);
      setLoading(false);
    };

    const getUserOrders = async (collectionName) => {
      const q = query(collection(db, collectionName), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = await Promise.all(snapshot.docs.map(async (doc) => {
        const itemsSnap = await getDocs(collection(db, collectionName, doc.id, "items"));
        const items = itemsSnap.docs.map(item => item.data());
        return { id: doc.id, ...doc.data(), items };
      }));
      return data;
    };

    fetchOrders();
  }, [user]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const renderMilestone = (status, progress) => {
    const steps = [
      { label: "Order Placed", icon: <FiBox /> },
      { label: "Processing", icon: <FiClock /> },
      { label: "Ready to Pickup", icon: <FiCheckCircle /> },
      { label: status === "Removed" ? "Order Cancelled" : "Picked Up", icon: status === "Removed" ? <FiXCircle /> : <FiCheckCircle /> }
    ];

    const activeIndex =
      status === "Removed"
        ? 3
        : progress === "Processing"
        ? 1
        : progress === "ReadytoPickup"
        ? 2
        : 3;

    return (
      <div className="flex flex-col relative space-y-6">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          return (
            <div key={index} className="flex flex-col items-start relative">
              <div className="flex items-center space-x-2 z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs z-10 ${
                    status === "Removed"
                      ? "bg-red-500"
                      : isActive
                      ? "bg-blue-600"
                      : isComplete
                      ? "bg-blue-400"
                      : "bg-gray-300"
                  }`}
                >
                  {step.icon}
                </div>
                <p className="text-sm font-medium">{step.label}</p>
              </div>
                {index < steps.length - 1 && (
                  <div
                      className={`absolute left-2.5 top-6 w-0.5 h-6 rounded-full ${
                        status === "Removed"
                            ? "bg-red-500"
                            : index < activeIndex
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                  ></div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOrderCard = (order) => {
    const isExpanded = expandedOrders[order.id];
    const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);

    return (
      <div key={order.id} className="bg-gray-100 rounded-lg shadow-lg p-5 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Milestones */}
          <div className="w-full md:w-1/3">{renderMilestone(order.status, order.progress)}</div>

          {/* Order Summary */}
          <div className="w-full md:w-2/3 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Order #{order.orderNumber}</h4>
              <span className="text-xm text-gray-800">Status: {order.status}</span>
            </div>
            <p className="text-sm text-gray-600">Email: {order.email}</p>
            <p className="text-sm text-gray-600">Username: {order.username}</p>
            <p className="text-sm text-gray-600">Total: Rs.{order.total}</p>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {visibleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 border p-2 rounded-md bg-gray-50"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} | Rs.{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {order.items.length > 3 && (
              <button
                className="text-blue-600 text-sm mt-1 hover:underline"
                onClick={() => toggleExpand(order.id)}
              >
                {isExpanded
                  ? "Show less"
                  : `+ ${order.items.length - 3} more items`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-4xl font-semibold mb-6 text-center">Your Order History</h2>

      {!user ? (
        <p className="text-center text-red-500 text-lg">
          Please make a Pre order and view your order history.
        </p>
      ) : loading ? (
        // ⬇️ Skeleton loader stays the same
        <div className="space-y-6">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-lg shadow-lg p-5 mb-6 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 space-y-4">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300" />
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="w-full md:w-2/3 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-48"></div>
                  <div className="h-3 bg-gray-300 rounded w-40"></div>
                  <div className="h-3 bg-gray-300 rounded w-36"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-4 border p-2 rounded-md bg-gray-50"
                      >
                        <div className="w-16 h-16 bg-gray-300 rounded-md" />
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-gray-300 rounded"></div>
                          <div className="h-3 w-20 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Current Orders */}
          {orders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Orders</h3>
              {orders.map((order) => renderOrderCard(order))}
            </div>
          )}

          {/* Previous Orders */}
          {pickupOrders.length + removedOrders.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-3">Previous Orders</h3>
              {[...pickupOrders, ...removedOrders].map((order) =>
                renderOrderCard(order)
              )}
            </div>
          )}

          {/* No Orders */}
          {orders.length === 0 &&
            pickupOrders.length === 0 &&
            removedOrders.length === 0 && (
              <p className="text-center text-gray-600">No orders found.</p>
            )}
        </>
      )}
    </div>
  );
}
