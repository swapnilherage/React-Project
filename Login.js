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



.login-page-container {
  background-image: linear-gradient(
    135deg,
    #F3FCF8 0%,
    #DFF0F3 50%,
    #E6F3EE 100%
  );
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-card {
  max-width: 420px;
  width: 100%;
  background: white;
  border-radius: 12px;
  border: none;
  padding: 2rem 2rem !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-img {
  width: 150px;
  height: auto;
  margin-bottom: 10px;
}

.company-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  height: 48px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  line-height: 48px;
  display: flex;
  align-items: center;
}

.form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
  outline: none;
  background-color: #f8f9fa;
}

.form-control::placeholder {
  color: #6c757d;
  opacity: 0.7;
}

/* Email input wrapper */
.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 48px;
}

.email-input {
  flex: 1;
  border-radius: 8px !important;
  height: 48px;
  margin: 0;
  width: 100%;
  padding: 0 16px !important;
  line-height: 48px;
  display: flex;
  align-items: center;
}

.email-spacer {
  display: none;
}

/* Password field wrapper */
.password-field-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.password-field-wrapper .form-control {
  flex: 1;
}

/* Password toggle button outside */
.password-toggle-btn-outside {
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle-btn-outside:hover {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.password-toggle-btn-outside:active {
  background: #004085;
  border-color: #004085;
  transform: translateY(0);
}

.forgot-link {
  text-align: right;
  font-size: 0.85rem;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 10px;
  margin-top: -10px;
  display: block;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.login-button {
  border: 2px solid #0056b3;
  background-color: #007bff;
  color: white;
  width: 100%;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  height: 50px;
}

.login-button:hover {
  background-color: #0056b3;
  border-color: #005663;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 86, 179, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem 1rem !important;
    width: 95%;
    max-width: 100%;
  }

  .company-title {
    font-size: 1.1rem;
  }

  .logo-img {
    width: 120px;
  }

  .password-toggle-btn {
    padding: 0 12px;
    font-size: 12px;
    min-width: 50px;
  }
}

