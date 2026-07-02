import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register, loading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    
    if (!name || !email || !phone || !address || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate phone number (basic validation)
    if (!/^[0-9]{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    const response = await register(name, email, phone, address, password);
    if (response.status) {
      // Navigate to login page after successful registration
      navigate("/login", { replace: true });
    } else {
      setError(response.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] pt-28 px-4 md:px-8 lg:px-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="mt-2 text-sm text-gray-600">Create an account to place orders and receive shipment notifications.</p>
        
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter your full name" 
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              type="email" 
              placeholder="Enter your email" 
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              type="tel" 
              placeholder="Enter your 10-digit phone number" 
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
              rows="3"
              placeholder="Enter your complete address" 
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent resize-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              type="password" 
              placeholder="Create a password (min 6 characters)" 
              className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-[#a97c50] focus:border-transparent" 
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full rounded-md bg-[#181818] px-4 py-3 text-white hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="text-[#a97c50] hover:underline" to={`/login?redirect=${encodeURIComponent(redirect)}`}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}