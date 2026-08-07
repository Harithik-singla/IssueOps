import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — check if token exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('issueops_token');
    const storedUser  = localStorage.getItem('issueops_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      const { token, user } = data.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('issueops_token', token);
      localStorage.setItem('issueops_user', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await authApi.register(formData);
      const { token, user } = data.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('issueops_token', token);
      localStorage.setItem('issueops_user', JSON.stringify(user));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('issueops_token');
    localStorage.removeItem('issueops_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};