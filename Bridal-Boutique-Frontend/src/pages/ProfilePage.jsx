import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Camera,
  Calendar,
  Heart,
  ShoppingBag,
  Award
} from "lucide-react";
import { API_BASE_URL } from "../services/api"; // ✅ Import API_BASE_URL

function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const validatePhone = (phone) => {
    const phoneClean = phone.replace(/[^0-9]/g, '');
    return phoneClean.length === 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.phone && !validatePhone(formData.phone)) {
      setMessage({ 
        type: "error", 
        text: "Please enter a valid 10-digit phone number" 
      });
      return;
    }

    const result = await updateProfile(formData);
    if (result?.status) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } else {
      setMessage({ type: "error", text: result?.message || "Failed to update profile" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-2xl max-w-md">
          <User size={64} className="mx-auto text-[#a97c50] mb-4" />
          <h2 className="text-2xl font-serif font-bold text-[#181818]">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Please login to view your profile</p>
          <Link to="/login" className="mt-6 inline-block px-8 py-3 bg-[#a97c50] text-white rounded-md hover:bg-[#8a6540] transition">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
         style={{ 
           backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
         }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 py-8 mt-20">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#a97c50] to-[#8a6540] rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center">
                <span className="text-4xl font-serif text-white font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {/* <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition">
                <Camera size={16} className="text-[#a97c50]" />
              </button> */}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-white">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
              <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start">
                <span className="flex items-center gap-1 text-white/90 text-sm bg-white/10 px-3 py-1 rounded-full">
                  <Heart size={14} className="text-pink-300" /> Member
                </span>
                <span className="flex items-center gap-1 text-white/90 text-sm bg-white/10 px-3 py-1 rounded-full">
                  <Award size={14} className="text-yellow-300" /> Premium
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link to="/orders" className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition text-sm font-medium">
                My Orders
              </Link>
              <Link to="/wishlist" className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition text-sm font-medium">
                Wishlist
              </Link>
            </div>
          </div>
        </div>

    
        {/* Profile Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-[#181818]">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 text-sm text-[#a97c50] border-2 border-[#a97c50] rounded-lg hover:bg-[#a97c50] hover:text-white transition font-medium"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition ${
                    isEditing 
                      ? "border-gray-300 bg-white" 
                      : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition ${
                  isEditing 
                    ? "border-gray-300 bg-white" 
                    : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
                placeholder="Enter your 10-digit phone number"
              />
              {isEditing && (
                <p className="text-xs text-gray-400 mt-1">Enter 10-digit phone number without spaces</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Shipping Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition ${
                  isEditing 
                    ? "border-gray-300 bg-white" 
                    : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
                placeholder="Enter your complete shipping address"
              />
            </div>

            {isEditing && (
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#a97c50] text-white px-8 py-3 rounded-xl hover:bg-[#8a6540] transition disabled:opacity-50 font-medium"
                >
                  <Save size={18} />
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || "",
                      phone: user.phone || "",
                      address: user.address || "",
                    });
                    setMessage({ type: "", text: "" });
                  }}
                  className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          {/* Profile Info Display when not editing */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-[#181818]">{user.name || "Not set"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-[#181818]">{user.phone || "Not set"}</p>
                </div>
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium text-[#181818]">{user.address || "Not set"}</p>
                </div>
                {/* <div className="md:col-span-2 bg-gradient-to-r from-[#f8f7f2] to-white p-4 rounded-xl border border-[#a97c50]/20">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-[#a97c50]">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "N/A"}
                  </p>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {/* Decorative Footer */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>✨ Bridal Boutique - Where Dreams Meet Elegance ✨</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;