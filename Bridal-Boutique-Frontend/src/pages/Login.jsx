import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, loading, user } = useAuth();
const [email, setEmail] = useState("");
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
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const response = await login(email, password);
    if (response.status) {
      setIsModalOpen(false);
      navigate(redirect, { replace: true });
    } else {
      setError(response.message || "Login failed");
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
          
          {/* Close Button */}
          <button 
            onClick={closeModal}
            className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md transition text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row min-h-[420px]">
            
            {/* Left Section - Compact Bridal Image */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-[#f8f7f2] to-[#e8dcc8] p-5 md:p-6 flex flex-col items-center justify-center relative overflow-hidden">
              
              {/* Decorative Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#a97c50]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#a97c50]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-[#a97c50]/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-[#a97c50]/10 rounded-full"></div>
                
                {/* Floating decorative dots */}
                <div className="absolute top-6 left-6 w-2 h-2 bg-[#a97c50]/20 rounded-full"></div>
                <div className="absolute top-12 right-12 w-3 h-3 bg-[#a97c50]/15 rounded-full"></div>
                <div className="absolute bottom-12 left-10 w-3 h-3 bg-[#a97c50]/10 rounded-full"></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-[#a97c50]/20 rounded-full"></div>
              </div>
              
              <div className="relative z-10 text-center w-full">
                {/* Brand Name - Padmavathi Collection */}
                <div className="mb-2">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#181818] tracking-wide">
                    Padmavathi
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#a97c50] font-medium">Collection</p>
                </div>

                {/* Compact Bridal Lehenga SVG */}
                <div className="mb-3 flex justify-center">
                  <div className="w-28 h-28 md:w-32 md:h-32 relative">
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#a97c50]/20 to-[#d4a574]/10 rounded-full blur-xl"></div>
                    <div className="absolute inset-3 bg-[#a97c50]/10 rounded-full"></div>
                    
                    {/* Bridal Lehenga SVG - Compact */}
                    <svg className="w-full h-full text-[#a97c50] relative z-10 drop-shadow-lg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Upper body/Blouse */}
                      <path d="M70 55 L70 45 C70 35 85 28 100 28 C115 28 130 35 130 45 L130 55" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15"/>
                      <path d="M75 55 L75 45 C75 37 88 32 100 32 C112 32 125 37 125 45 L125 55" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                      
                      {/* Neckline - Sweetheart */}
                      <path d="M80 42 C88 35 112 35 120 42" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                      
                      {/* Main Lehenga */}
                      <path d="M70 55 L70 65 C70 70 73 75 76 78 L76 145 C76 160 88 175 100 175 C112 175 124 160 124 145 L124 78 C127 75 130 70 130 65 L130 55" fill="currentColor" opacity="0.25"/>
                      
                      {/* Lehenga flares */}
                      <path d="M76 145 C68 165 78 185 100 185 C122 185 132 165 124 145" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                      <path d="M70 145 C60 168 72 192 100 192 C128 192 140 168 130 145" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
                      
                      {/* Decorative borders */}
                      <path d="M76 135 C84 130 92 128 100 128 C108 128 116 130 124 135" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M76 125 C84 120 92 118 100 118 C108 118 116 120 124 125" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
                      
                      {/* Dupatta - Flowing */}
                      <path d="M60 50 C45 40 30 48 25 65 C20 82 28 100 40 108" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
                      <path d="M140 50 C155 40 170 48 175 65 C180 82 172 100 160 108" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
                      
                      {/* Jewellery */}
                      <circle cx="88" cy="46" r="3.5" fill="currentColor" opacity="0.8"/>
                      <circle cx="96" cy="43" r="4" fill="currentColor" opacity="0.8"/>
                      <circle cx="104" cy="43" r="4" fill="currentColor" opacity="0.8"/>
                      <circle cx="112" cy="46" r="3.5" fill="currentColor" opacity="0.8"/>
                      
                      {/* Maang Tikka */}
                      <circle cx="100" cy="32" r="2" fill="#e74c3c" opacity="0.9"/>
                      
                      {/* Decorative dots */}
                      {[78, 84, 90, 96, 102, 108, 114, 120].map((x, i) => (
                        <circle key={i} cx={x} cy={155 + (i % 4) * 6} r="2" fill="currentColor" opacity="0.3 + (i % 3) * 0.1"/>
                      ))}
                      
                      {/* Waistband */}
                      <rect x="76" y="78" width="48" height="5" rx="2.5" fill="currentColor" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
                
                {/* Offer Badge - Compact */}
                <div className="inline-block bg-[#a97c50]/10 px-3 py-1 rounded-full mb-2">
                  <span className="text-[#a97c50] font-medium text-[10px]">✨ Exclusive</span>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-bold text-[#181818]">FLAT</span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-2xl font-bold text-[#a97c50]">30-50</span>
                    <span className="text-[10px] text-gray-500">%</span>
                  </div>
                  <span className="text-lg font-bold text-[#181818]">OFF</span>
                </div>
              </div>
              
              {/* Bottom Decorative Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#a97c50] to-transparent"></div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full md:w-3/5 p-6 md:p-8 bg-white">
              <div className="max-w-sm mx-auto">
                <h2 className="text-xl font-semibold text-[#181818]">Welcome Back</h2>
                <p className="mt-0.5 text-xs text-gray-500">Login to your account</p>
                
                {error && (
                  <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                 <div>
  <label className="block text-[11px] font-medium text-gray-700 mb-1">
    Email Address *
  </label>

  <input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    type="email"
    placeholder="Enter your email"
    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white"
  />
</div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      type="password" 
                      placeholder="Enter your password" 
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#a97c50] focus:border-transparent transition outline-none bg-gray-50 hover:bg-white" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full rounded-lg bg-[#a97c50] px-4 py-2.5 text-white text-sm font-medium hover:bg-[#8a6b40] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 shadow-md hover:shadow-lg"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
                
                {/* Terms */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-[#a97c50] hover:underline font-medium">Privacy Policy</a> &{" "}
                    <a href="#" className="text-[#a97c50] hover:underline font-medium">T&C's</a>
                  </p>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 text-center">
                  New customer?{" "}
                  <Link 
                    className="text-[#a97c50] font-semibold hover:underline" 
                    to={`/register?redirect=${encodeURIComponent(redirect)}`}
                  >
                    Create Account
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
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}