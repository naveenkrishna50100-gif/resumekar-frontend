import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rk_token');
    const savedUser = localStorage.getItem('rk_user');
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        loadProfile();
      } catch (e) {
        localStorage.removeItem('rk_token');
        localStorage.removeItem('rk_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data.profile);
    } catch (e) {
      localStorage.removeItem('rk_token');
      localStorage.removeItem('rk_user');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = (token, userData) => {
    localStorage.setItem('rk_token', token);
    localStorage.setItem('rk_user', JSON.stringify(userData));
    setUser(userData);
    loadProfile();
  };

  const logout = () => {
    localStorage.removeItem('rk_token');
    localStorage.removeItem('rk_user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginUser, logout, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
