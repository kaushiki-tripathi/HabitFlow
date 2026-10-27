import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "habitflow_token";
const USER_KEY = "habitflow_user";

const API_BASE_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  const openLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  const openSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  const closeAuthModals = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  };

  // Save session when token or user changes
  useEffect(() => {
    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, [token, user]);

  // Register User (Email/Password)
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      setUser({
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar || "",
        about: data.data.about || "",
        phone: data.data.phone || "",
        gender: data.data.gender || "",
        country: data.data.country || "",
        authProvider: data.data.authProvider || "local",
        createdAt: data.data.createdAt,
      });
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login User (Email/Password)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      setUser({
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar || "",
        about: data.data.about || "",
        phone: data.data.phone || "",
        gender: data.data.gender || "",
        country: data.data.country || "",
        authProvider: data.data.authProvider || "local",
        createdAt: data.data.createdAt,
      });
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Google Login / Sign-up
  const googleLogin = async (credential) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }

      setUser({
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        avatar: data.data.avatar || "",
        about: data.data.about || "",
        phone: data.data.phone || "",
        gender: data.data.gender || "",
        country: data.data.country || "",
        authProvider: data.data.authProvider || "google",
        createdAt: data.data.createdAt,
      });
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (profileData, email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          typeof profileData === "string" ? { name: profileData, email } : profileData
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const { token: nextToken, ...updatedUser } = data.data;
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }));

      if (nextToken) {
        setToken(nextToken);
      }

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteHabitData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/data`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete habit data");
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete account");
      logout();
      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        googleLogin,
        updateProfile,
        updatePassword,
        deleteHabitData,
        deleteAccount,
        logout,
        isAuthenticated: !!token,
        loginModalOpen,
        signupModalOpen,
        openLogin,
        openSignup,
        closeAuthModals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}