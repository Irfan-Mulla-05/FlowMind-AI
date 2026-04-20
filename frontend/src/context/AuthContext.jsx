import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = storage.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.me();
        setUser(data.user);
        document.body.classList.toggle("light", data.user.preferredTheme === "light");
      } catch (_error) {
        storage.clearToken();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const applyTheme = (theme) => {
    document.body.classList.toggle("light", theme === "light");
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    storage.setToken(data.token);
    setUser(data.user);
    applyTheme(data.user.preferredTheme);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    storage.setToken(data.token);
    setUser(data.user);
    applyTheme(data.user.preferredTheme);
    return data;
  };

  const logout = () => {
    storage.clearToken();
    setUser(null);
  };

  const refreshMe = async () => {
    const data = await authApi.me();
    setUser(data.user);
    applyTheme(data.user.preferredTheme);
  };

  const updateProfile = async (payload) => {
    const data = await authApi.updateProfile(payload);
    setUser(data.user);
    applyTheme(data.user.preferredTheme);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      updateProfile
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
