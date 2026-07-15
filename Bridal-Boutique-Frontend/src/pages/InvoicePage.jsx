import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { 
  Download, 
  Printer, 
  X, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import html2pdf from "html2pdf.js";



export default function InvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchInvoice();
  }, [id, user]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await api.get(`invoice/get_invoice.php?id=${id}`);
      console.log("Invoice Response:", response.data);
      
      if (response.data?.status) {
        setInvoice(response.data.data);
      } else {
        setError(response.data?.message || "Invoice not found");
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    const opt = {
      margin: [10, 10, 12, 10],
      filename: `invoice-${invoice?.invoice_no || 'download'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a97c50] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#181818]">Invoice Not Found</h2>
          <p className="text-gray-500 mt-2">{error || "The invoice you're looking for doesn't exist."}</p>
          <Link to="/orders" className="mt-4 inline-block px-6 py-2 bg-[#a97c50] text-white rounded-lg hover:bg-[#8a6540] transition">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();
    const statusMap = {
      paid: { color: "bg-green-100 text-green-700", dot: "bg-green-500" },
      pending: { color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
      partial: { color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
      online: { color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
    };
    return statusMap[normalized] || { color: "bg-gray-100 text-gray-700", dot: "bg-gray-400" };
  };

  const statusInfo = getStatusBadge(invoice.payment_status);
  const statusLabel = invoice.payment_status ? invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1) : "N/A";

  const itemsGst = (invoice.items || []).reduce(
    (sum, it) => sum + (Number(it.qty || it.quantity) * Number(it.price) * Number(it.gst_percentage || 0)) / 100,
    0
  );
  const gstShown = parseFloat(invoice.gst_total || 0) || itemsGst;

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link 
            to="/orders" 
            className="flex items-center gap-2 text-gray-600 hover:text-[#a97c50] transition"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </Link>
          <div className="flex gap-3">
            {/* <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              <Printer size={16} />
              Print
            </button> */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#a97c50] text-white rounded-lg hover:bg-[#8a6540] transition text-sm font-medium"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
          {/* Header */}
          <style>{`@media print { .invoice-status-pill { display: none !important; } }`}</style>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-9 h-9 rounded-lg bg-[#a97c50] text-white flex items-center justify-center font-bold text-lg">B</div>
                 <h1 className="text-2xl font-serif font-bold text-[#181818]">INVOICE</h1>
               </div>
              <p className="text-sm text-gray-500"># {invoice.invoice_no}</p>
            </div>
            <div className="mt-3 md:mt-0 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className={`invoice-status-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${statusInfo.dot}`}></span>
                  {invoice.payment_status ? invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1) : "N/A"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Date: {new Date(invoice.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Company & Customer Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#f8f7f2] p-4 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">From</h3>
              <p className="font-semibold text-[#181818]">{invoice.company_name || "Bridal Boutique"}</p>
              <p className="text-sm text-gray-600">{invoice.company_address || "123 Bridal Street,"}</p>
              <p className="text-sm text-gray-600">{invoice.company_address ? "" : "Chennai - 600001"}</p>
              <p className="text-sm text-gray-600">Phone: {invoice.company_phone || "+91 98765 43210"}</p>
              <p className="text-sm text-gray-600">Email: {invoice.company_email || "info@bridalboutique.com"}</p>
              <p className="text-sm text-gray-600">GST: {invoice.company_gstin || "22AAAAA0000A1Z5"}</p>
            </div>
            <div className="bg-[#f8f7f2] p-4 rounded-lg">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
              <p className="font-semibold text-[#181818]">{invoice.customer_name}</p>
              <p className="text-sm text-gray-600 flex items-start gap-1">
                <span className="text-gray-400 w-14 shrink-0">Phone</span>
                <span>{invoice.customer_phone || invoice.mobile || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-start gap-1">
                <span className="text-gray-400 w-14 shrink-0">Address</span>
                <span>{invoice.shipping_address || invoice.address || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-start gap-1">
                <span className="text-gray-400 w-14 shrink-0">Email</span>
                <span>{invoice.email || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f7f2]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">GST</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#181818]">{item.product_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.size || "-"}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{item.qty || item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">₹{parseFloat(item.price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {parseFloat(item.gst_percentage || 0)}%
                        <div className="text-[11px] text-gray-400">
                          ₹{parseFloat(((item.qty || item.quantity) * item.price * (item.gst_percentage || 0)) / 100).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-[#a97c50]">
                        ₹{parseFloat((item.qty || item.quantity) * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex flex-col items-end border-t border-gray-200 pt-6">
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{parseFloat(invoice.sub_total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST</span>
                <span className="font-medium">₹{parseFloat(gstShown || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span className="text-[#181818]">Total</span>
                <span className="text-[#a97c50]">₹{parseFloat(invoice.total_amount || invoice.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid</span>
                <span className="font-medium text-green-600">₹{parseFloat(invoice.paid_amount || 0).toLocaleString()}</span>
              </div>
              {invoice.balance_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Balance</span>
                  <span className="font-medium text-red-600">₹{parseFloat(invoice.balance_amount).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium text-[#181818] capitalize">{invoice.payment_method || "N/A"}</p>
            </div>
            
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
            <p>Thank you for your business!</p>
            <p className="mt-1">This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


