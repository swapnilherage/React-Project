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



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginScreen.css';
import scgbs from '../../Data/Images/download.png';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  
  const credentials = {
    user: {
      email: 'user@sc.com',
      password: '123'
    },
    admin: {
      email: 'admin@sc.com',
      password: '123'
    },
    operations: {
      email: 'operations@sc.com',
      password: '123'
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      console.log('Attempting login with:', email, password);
      await login(email, password);
      console.log('Login successful, navigating...');

      // Navigate based on user role after successful login
      const userRole = localStorage.getItem('userRole');
      console.log('User role from localStorage:', userRole);
      if (userRole === 'User') {
        navigate('/User/Dashboard');
      } else if (userRole === 'Admin') {
        navigate('/Admin/Dashboard');
      } else if (userRole === 'Operations') {
        navigate('/OpsPage/OpsPage');
      }
    } catch (error) {
      console.log('Login failed:', error.message);
      alert('Login Failed: ' + error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-container">
      <div className="card login-card shadow-lg p-4 p-md-5">
        <div className="text-center mb-4">
          <img src={scgbs} alt="Standard Chartered Logo" className="logo-img" />
          <h2 className="company-title">User Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                className="form-control email-input"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="email-spacer"></div>
            </div>
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <div className="password-field-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn-outside"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-end mb-4">
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary btn-lg login-button">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

