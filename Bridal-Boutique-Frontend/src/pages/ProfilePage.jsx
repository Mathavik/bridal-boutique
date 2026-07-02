import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from "lucide-react";

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
    // Clear message when user starts typing
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

    // Validate phone number if provided
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Please login to view your profile</p>
          <Link to="/login" className="mt-4 inline-block text-[#a97c50] hover:underline">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#181818]">
          My Profile
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-[#a97c50] border border-[#a97c50] rounded-md hover:bg-[#a97c50] hover:text-white transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md flex items-start gap-3 ${
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#a97c50] focus:border-transparent ${
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
              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#a97c50] focus:border-transparent ${
                isEditing 
                  ? "border-gray-300 bg-white" 
                  : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
              }`}
              placeholder="Enter your 10-digit phone number"
            />
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">Enter 10-digit phone number without spaces</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#a97c50] focus:border-transparent ${
                isEditing 
                  ? "border-gray-300 bg-white" 
                  : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
              }`}
              placeholder="Enter your complete address"
            />
          </div>

          {isEditing && (
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#a97c50] text-white px-6 py-2.5 rounded-md hover:bg-[#8a6540] transition disabled:opacity-50"
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
                className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Profile Info Display when not editing */}
        {!isEditing && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone || "Not set"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;