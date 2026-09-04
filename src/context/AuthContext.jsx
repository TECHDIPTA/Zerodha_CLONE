import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

const AuthContext = createContext(null);

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3002";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // CHECK CURRENT AUTHENTICATION
  // =========================================================

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/current-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => null);

      if (res.ok && data) {
        setUser(data.user || data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(
          data.message ||
            "Logout failed. Please try again."
        );

        return false;
      }

      // Remove user from React state
      setUser(null);

      // IMPORTANT:
      // Do NOT show success toast here.
      // Navbar will show it AFTER the redirect.

      return true;

    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );

      toast.error(
        "Logout failed. Please try again."
      );

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);