import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null); // For JWT token

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    const storedToken = localStorage.getItem('token');
    console.log('AuthContext useEffect - storedUser:', storedUser, 'storedRole:', storedRole);
    if (storedUser && storedRole) {
      setUser(storedUser);
      setUserRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Static login logic (current implementation)
      let role;
      if (email === 'admin@sc.com' && password === '123') {
        role = 'Admin';
      } else if (email === 'user@sc.com' && password === '123') {
        role = 'User';
      } else if (email === 'operations@sc.com' && password === '123') {
        role = 'Operations';
      } else {
        throw new Error('Invalid credentials');
      }

      setUser(email);
      setUserRole(role);
      localStorage.setItem('user', email);
      localStorage.setItem('userRole', role);

      // Commented API login call - uncomment when backend is ready
      /*
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user.email);
        setUserRole(data.user.role);
        setToken(data.token);
        localStorage.setItem('user', data.user.email);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error('Login failed');
      }
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

