import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";
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

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/user_login.php`, { email, password });
      if (response.data?.status) {
        setUser(response.data.data);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/user_register.php`, { name, email, password });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
