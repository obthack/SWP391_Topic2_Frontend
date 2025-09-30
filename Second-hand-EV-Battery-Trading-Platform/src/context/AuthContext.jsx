// AuthContext.jsx - Context để quản lý trạng thái đăng nhập của user
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // State quản lý thông tin user hiện tại
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra localStorage khi component mount để duy trì session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Kiểm tra user có phải admin không
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Kiểm tra user có phải member không
  const isMember = () => {
    return user && user.role === 'member';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isMember,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};