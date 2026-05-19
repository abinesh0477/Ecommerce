import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    // Dispatch custom event for CartContext to know user changed
    window.dispatchEvent(new Event('storage'));
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    setUser(data.user);
    window.dispatchEvent(new Event('storage'));
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};