import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register, loading, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const response = await register(name, email, password);
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
        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className="w-full rounded-md border px-3 py-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-[#181818] px-4 py-3 text-white">{loading ? "Creating account..." : "Register"}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <Link className="text-[#a97c50]" to={`/login?redirect=${encodeURIComponent(redirect)}`}>Login</Link>
        </p>
      </div>
    </div>
  );
}
