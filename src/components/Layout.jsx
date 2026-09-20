import React from 'react';
import Sidebar from './common/Sidebar';
import NavigationBar from './common/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import './common/Sidebar.css';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if current page is Home or Login (Public Pages)
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="app-wrapper">
      {/* ✅ Show Navbar ONLY on Public Pages (Home & Login) */}
      {isPublicPage && <NavigationBar />}
      
      {/* ✅ Show Sidebar ONLY on Dashboard Pages (Authenticated) */}
      {isAuthenticated && !isPublicPage && <Sidebar />}
      
      <div className={`main-content ${isPublicPage ? 'public-page' : ''} ${!isAuthenticated ? 'no-sidebar' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;