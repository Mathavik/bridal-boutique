import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginBanner from "../assets/LoginBanner.png";

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
  const [isModalOpen, setIsModalOpen] = useState(true);

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

    if (!/^[0-9]{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    const response = await register(name, email, phone, address, password);
    if (response.status) {
      setIsModalOpen(false);
      navigate("/login", { replace: true });
    } else {
      setError(response.message || "Registration failed");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
          
          {/* Close Button */}
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg transition text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row-reverse min-h-[520px]">
            <div className="w-full md:w-1/2 overflow-hidden">
              <img
                src={LoginBanner}
                alt="Login banner"
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Left Section - Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-white overflow-y-auto">
              <div className="max-w-sm mx-auto">
                <h2 className="text-xl font-semibold text-[#181818]">Create Account</h2>
                <p className="mt-1 text-xs text-gray-500">Create an account to place orders and receive shipment notifications.</p>
                
                {error && (
                  <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      placeholder="Enter your full name" 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      type="tel" 
                      placeholder="Enter your 10-digit phone number" 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      required 
                      rows="2"
                      placeholder="Enter your complete address" 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition resize-none outline-none bg-gray-50 hover:bg-white" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      type="password" 
                      placeholder="Create a password (min 6 characters)" 
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full rounded-xl bg-[#a97c50] px-4 py-3 text-white text-sm font-medium hover:bg-[#8a6b40] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1 shadow-lg hover:shadow-xl"
                  >
                    {loading ? "Creating account..." : "Register"}
                  </button>
                </form>
                
                {/* Terms */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    I accept that I have read & understood{" "}
                    <a href="#" className="text-[#a97c50] hover:underline font-medium">Privacy Policy</a> and{" "}
                    <a href="#" className="text-[#a97c50] hover:underline font-medium">T&C's</a>.
                  </p>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link 
                    className="text-[#a97c50] font-semibold hover:underline" 
                    to={`/login?redirect=${encodeURIComponent(redirect)}`}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}