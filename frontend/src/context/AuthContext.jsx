import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify user using cookie-based token

  const verifyUser = async () => {
    try {
      const response = await api.get("/user/profile", {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run once on app load
  useEffect(() => {
    verifyUser();
  }, []);

  // Login
  const login = async (credentials) => {
    try {
      const response = await api.post("/user/login", credentials, {
        withCredentials: true,
      });

      if (response.data.success) {
        await verifyUser();
        return { success: true, message: response.data.message };
      }

      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
