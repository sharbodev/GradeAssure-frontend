import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate auth state from localStorage on load
  useEffect(() => {
    const token = localStorage.getItem('gradeassure_token');
    const role = localStorage.getItem('gradeassure_role');
    const email = localStorage.getItem('gradeassure_email');

    if (token && role && email) {
      setUser({ email, role, token });
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Endpoint: POST api/v1/auth/login?email=...&password=...
      const response = await axiosInstance.post(`/api/v1/auth/login`, null, {
        params: { email, password }
      });
      const { token, role, message } = response.data;
      
      localStorage.setItem('gradeassure_token', token);
      localStorage.setItem('gradeassure_role', role);
      localStorage.setItem('gradeassure_email', email);

      setUser({ email, role, token });
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true, role, message };
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (registerData) => {
    setIsLoading(true);
    try {
      // Endpoint: POST api/v1/auth/register with RegisterRequest body
      const response = await axiosInstance.post(`/api/v1/auth/register`, registerData);
      const { token, role, email, message } = response.data;
      
      localStorage.setItem('gradeassure_token', token);
      localStorage.setItem('gradeassure_role', role);
      localStorage.setItem('gradeassure_email', email);

      setUser({ email, role, token });
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true, role, message };
    } catch (error) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.message || 'Registration failed.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('gradeassure_token');
    localStorage.removeItem('gradeassure_role');
    localStorage.removeItem('gradeassure_email');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
