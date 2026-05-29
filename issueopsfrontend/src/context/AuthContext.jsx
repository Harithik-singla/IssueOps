import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { currentUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('issueops_user');
    const storedToken = localStorage.getItem('issueops_token');
    if (stored && storedToken) {
      setUser(JSON.parse(stored));
      setToken(storedToken);
    } else {
      // Mock auto-login for demo
      setUser(currentUser);
      setToken('demo_token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('issueops_user', JSON.stringify(data.user));
      localStorage.setItem('issueops_token', data.token);
      return { success: true };
    } catch {
      // Demo fallback
      setUser(currentUser);
      setToken('demo_token');
      localStorage.setItem('issueops_user', JSON.stringify(currentUser));
      localStorage.setItem('issueops_token', 'demo_token');
      return { success: true };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await authApi.register(formData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('issueops_user', JSON.stringify(data.user));
      localStorage.setItem('issueops_token', data.token);
      return { success: true };
    } catch {
      setUser({ ...currentUser, name: formData.name, email: formData.email });
      setToken('demo_token');
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('issueops_user');
    localStorage.removeItem('issueops_token');
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
