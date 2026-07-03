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
            
            {/* Right Section - Grand Bridal Image with Branding */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-[#f8f7f2] to-[#e8dcc8] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
              
              {/* Decorative Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#a97c50]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a97c50]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-[#a97c50]/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-[#a97c50]/10 rounded-full"></div>
                
                {/* Floating decorative dots */}
                <div className="absolute top-10 left-10 w-3 h-3 bg-[#a97c50]/20 rounded-full"></div>
                <div className="absolute top-20 right-20 w-4 h-4 bg-[#a97c50]/15 rounded-full"></div>
                <div className="absolute bottom-20 left-16 w-5 h-5 bg-[#a97c50]/10 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-3 h-3 bg-[#a97c50]/20 rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center w-full">
                {/* Brand Name - Padmavathi Collection */}
                <div className="mb-3">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#181818] tracking-wide">
                    Padmavathi
                  </h1>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#a97c50] font-medium">Collection</p>
                </div>

                {/* Grand Bridal Lehenga SVG */}
                <div className="mb-5 flex justify-center">
                  <div className="w-36 h-36 md:w-44 md:h-44 relative">
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a97c50]/20 to-[#d4a574]/10 rounded-full blur-2xl"></div>
                    <div className="absolute inset-4 bg-[#a97c50]/10 rounded-full"></div>
                    
                    {/* Bridal Lehenga SVG - Detailed */}
                    <svg className="w-full h-full text-[#a97c50] relative z-10 drop-shadow-xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Upper body/Blouse */}
                      <path d="M70 55 L70 45 C70 35 85 28 100 28 C115 28 130 35 130 45 L130 55" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15"/>
                      <path d="M75 55 L75 45 C75 37 88 32 100 32 C112 32 125 37 125 45 L125 55" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                      
                      {/* Neckline - Sweetheart */}
                      <path d="M80 42 C88 35 112 35 120 42" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                      <path d="M85 40 C92 34 108 34 115 40" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      
                      {/* Main Lehenga */}
                      <path d="M70 55 L70 65 C70 70 73 75 76 78 L76 145 C76 160 88 175 100 175 C112 175 124 160 124 145 L124 78 C127 75 130 70 130 65 L130 55" fill="currentColor" opacity="0.25"/>
                      
                      {/* Lehenga flares - Layered */}
                      <path d="M76 145 C68 165 78 185 100 185 C122 185 132 165 124 145" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                      <path d="M70 145 C60 168 72 192 100 192 C128 192 140 168 130 145" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
                      <path d="M65 145 C52 170 66 198 100 198 C134 198 148 170 135 145" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
                      
                      {/* Decorative borders on lehenga */}
                      <path d="M76 135 C84 130 92 128 100 128 C108 128 116 130 124 135" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M76 125 C84 120 92 118 100 118 C108 118 116 120 124 125" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
                      <path d="M76 115 C84 110 92 108 100 108 C108 108 116 110 124 115" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
                      
                      {/* Dupatta - Flowing */}
                      <path d="M60 50 C45 40 30 48 25 65 C20 82 28 100 40 108" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7"/>
                      <path d="M140 50 C155 40 170 48 175 65 C180 82 172 100 160 108" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.7"/>
                      <path d="M55 55 C40 45 25 55 20 70 C15 88 25 105 38 112" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      <path d="M145 55 C160 45 175 55 180 70 C185 88 175 105 162 112" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      
                      {/* Jewellery - Necklace */}
                      <circle cx="88" cy="46" r="3.5" fill="currentColor" opacity="0.8"/>
                      <circle cx="96" cy="43" r="4" fill="currentColor" opacity="0.8"/>
                      <circle cx="104" cy="43" r="4" fill="currentColor" opacity="0.8"/>
                      <circle cx="112" cy="46" r="3.5" fill="currentColor" opacity="0.8"/>
                      <path d="M88 50 C92 54 96 56 100 56 C104 56 108 54 112 50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      
                      {/* Maang Tikka */}
                      <circle cx="100" cy="32" r="2" fill="#e74c3c" opacity="0.9"/>
                      <path d="M98 34 L100 38 L102 34" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.6"/>
                      
                      {/* Arm ornaments */}
                      <rect x="72" y="52" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
                      <rect x="124" y="52" width="4" height="8" rx="2" fill="currentColor" opacity="0.6"/>
                      
                      {/* Decorative dots on lehenga */}
                      {[78, 84, 90, 96, 102, 108, 114, 120].map((x, i) => (
                        <circle key={i} cx={x} cy={155 + (i % 4) * 6} r="2" fill="currentColor" opacity="0.3 + (i % 3) * 0.1"/>
                      ))}
                      
                      {/* Waistband */}
                      <rect x="76" y="78" width="48" height="5" rx="2.5" fill="currentColor" opacity="0.3"/>
                      <rect x="80" y="80" width="40" height="2" rx="1" fill="currentColor" opacity="0.2"/>
                      
                      {/* Kundan/Stone details */}
                      <circle cx="90" cy="72" r="1.5" fill="currentColor" opacity="0.5"/>
                      <circle cx="100" cy="70" r="2" fill="currentColor" opacity="0.5"/>
                      <circle cx="110" cy="72" r="1.5" fill="currentColor" opacity="0.5"/>
                    </svg>
                  </div>
                </div>
                
                {/* Celebration Badge */}
                <div className="inline-block bg-[#a97c50]/10 px-5 py-1.5 rounded-full mb-3">
                  <span className="text-[#a97c50] font-medium text-xs">✨ Celebration</span>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-bold text-[#181818]">FLAT</span>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-[#a97c50]">30-50</span>
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <span className="text-2xl font-bold text-[#181818]">OFF</span>
                </div>
                
                <div className="mt-3">
                  <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#a97c50] to-transparent"></div>
                  <p className="text-xs text-gray-600 mt-2 font-light">Create your account</p>
                </div>
              </div>
              
              {/* Bottom Decorative Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#a97c50] to-transparent"></div>
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