import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { 
  Package, 
  Calendar, 
  Eye, 
  X, 
  Clock, 
  CheckCircle, 
  FileText, 
  Truck, 
  Copy, 
  Check,
  ShoppingBag
} from "lucide-react";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend";

// Helper function to format date without date-fns
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
};

function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/checkout/get_user_orders.php?user_id=${user.id}`);
      console.log("Orders API Response:", response.data);
      
      if (response.data?.status) {
        setOrders(response.data.data);
      } else {
        console.log("No orders found or error:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await axios.post(`${API_BASE}/api/checkout/cancel_order.php`, {
        order_id: orderId,
        user_id: user.id,
      });
      if (response.data?.status) {
        fetchOrders();
        alert("Order cancelled successfully!");
      } else {
        alert(response.data?.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const viewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      confirmed: "bg-blue-100 text-blue-800",
      packed: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={16} />,
      processing: <Package size={16} />,
      confirmed: <CheckCircle size={16} />,
      packed: <Package size={16} />,
      shipped: <Truck size={16} />,
      delivered: <CheckCircle size={16} />,
      cancelled: <X size={16} />,
    };
    return icons[status] || <Clock size={16} />;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please login to view your orders</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-serif font-bold text-[#181818] mb-8">
        My Orders
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a97c50]"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-400">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      Order #{order.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        order.status || 'pending'
                      )}`}
                    >
                      {getStatusIcon(order.status || 'pending')}
                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Paid" : "Pending"}
                    </span>
                    
                    {/* ✅ Courier ID Badge */}
                    {order.tracking_id && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        <Truck size={12} />
                        {order.tracking_id}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formatDate(order.created_at)}
                    </p>
                    <p>Items: {order.items?.length || 0}</p>
                    <p className="font-semibold text-[#a97c50]">
                      ₹{parseFloat(order.total || 0).toLocaleString()}
                    </p>
                    {order.tracking_id && order.shipped_at && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Truck size={12} />
                        Shipped on: {formatDate(order.shipped_at)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-[#a97c50] border border-[#a97c50] rounded-lg hover:bg-[#a97c50] hover:text-white transition"
                  >
                    <Eye size={16} />
                    View Details
                  </button>

                  <button
                    onClick={() => viewInvoice(order.id)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                  >
                    <FileText size={16} />
                    View Invoice
                  </button>

                  {(order.status || 'pending') !== "cancelled" && (order.status || 'pending') !== "delivered" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Order #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrder.status || 'pending'
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status || 'pending')}
                    {(selectedOrder.status || 'pending').charAt(0).toUpperCase() +
                      (selectedOrder.status || 'pending').slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-medium">
                    {selectedOrder.payment_status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(selectedOrder.created_at)}</span>
                </div>
                
                {/* ✅ Tracking ID in Modal */}
                {selectedOrder.tracking_id && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Tracking ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-[#a97c50] bg-gray-50 px-3 py-1 rounded-lg">
                        {selectedOrder.tracking_id}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedOrder.tracking_id)}
                        className="p-1.5 text-gray-400 hover:text-[#a97c50] transition rounded-lg hover:bg-gray-100"
                      >
                        {copiedId === selectedOrder.tracking_id ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {selectedOrder.shipped_at && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Shipped Date:</span>
                    <span className="font-medium">{formatDate(selectedOrder.shipped_at)}</span>
                  </div>
                )}
                {selectedOrder.delivered_at && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Delivered Date:</span>
                    <span className="font-medium">{formatDate(selectedOrder.delivered_at)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Customer:</span>
                  <span className="text-right max-w-[60%]">
                    {selectedOrder.customer_name}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-right max-w-[60%]">
                    {selectedOrder.email}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="text-right max-w-[60%]">
                    {selectedOrder.mobile}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Shipping Address:</span>
                  <span className="text-right max-w-[60%]">
                    {selectedOrder.shipping_address}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b pb-3 last:border-0"
                    >
                      <img
                        src={
                          item.image
                            ? `${API_BASE}/api/${item.image}`
                            : "/placeholder.jpg"
                        }
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          console.log("Image failed:", e.target.src);
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{parseFloat(item.price || 0).toLocaleString()}
                          {item.size ? ` • Size: ${item.size}` : ''}
                        </p>
                        <p className="font-semibold text-[#a97c50] text-sm">
                          ₹{parseFloat(item.total || item.price * item.quantity || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-[#a97c50]">
                  ₹{parseFloat(selectedOrder.total || 0).toLocaleString()}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {selectedOrder.tracking_id && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.tracking_id);
                      setCopiedId(selectedOrder.tracking_id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Copy size={16} />
                    Copy Tracking ID
                  </button>
                )}
                <button
                  onClick={() => viewInvoice(selectedOrder.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#a97c50] text-white rounded-lg hover:bg-[#8a6540] transition"
                >
                  <FileText size={16} />
                  View Full Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;