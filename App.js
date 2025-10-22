import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';
import './LayoutFix.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AdminPathConfig from './pages/admin/AdminPathConfig';
import LoginScreen from './pages/LoginPage/LoginScreen';
import UserDashboard from './pages/user/Dashboard';
import SubscriptionStatus from './pages/user/Subscription_Status';
import UserSubscribe from './pages/user/User_Subscribe';
import OpsPage from './pages/operations/OpsPage';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <Sidebar />}
      
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        
        <Route
          path="/User/Dashboard"
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <div className="main-content">
                <UserDashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription_status"
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <div className="main-content">
                <SubscriptionStatus />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_subscribe"
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <div className="main-content">
                <UserSubscribe />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/Admin/Dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <div className="main-content">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <div className="main-content">
                <Users />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/path_configuration"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <div className="main-content">
                <AdminPathConfig />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/OpsPage/OpsPage"
          element={
            <ProtectedRoute allowedRoles={['Operations']}>
              <div className="main-content">
                <OpsPage />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
