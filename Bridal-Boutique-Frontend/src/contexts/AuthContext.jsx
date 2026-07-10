// AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
// 👇 Import the shared base URL from api.js
import { API_BASE_URL } from "../services/api";   // adjust path if needed

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("botik_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("botik_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("botik_user");
    }
  }, [user]);

  // ✅ Now use the imported API_BASE_URL
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/user_login.php`, { email, password });
      if (response.data?.status) {
        setUser(response.data.data);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, address, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/user_register.php`, { 
        name, 
        email, 
        phone, 
        address, 
        password 
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("botik_user");
    setUser(null);
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/update_user_profile.php`, {
        user_id: user.id,
        name: userData.name,
        phone: userData.phone,
        address: userData.address
      });
      if (response.data?.status) {
        setUser(response.data.data);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ 
      user, 
      loading, 
      login, 
      register, 
      logout,
      updateProfile 
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);