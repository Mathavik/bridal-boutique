// AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";

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
        password,
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
        address: userData.address,
      });
      if (response.data?.status) {
        setUser(response.data.data);
      }
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Change password using auth context
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/user_change_password.php`, {
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Forgot Password – sends reset link to email
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/user_forgot_password.php`, { email });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Reset Password – uses token + new password
  const resetPassword = async (token, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/user_reset_password.php`, {
        token,
        password: newPassword,
        confirm_password: confirmPassword,
      });
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
      updateProfile,
      changePassword, // ✅ expose it
       forgotPassword,   // expose
      resetPassword,    // expose
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);