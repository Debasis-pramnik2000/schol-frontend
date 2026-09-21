
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';

import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set token for API requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user
  const loadUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Load user error:', error);

      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  // Login
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      toast.success(`Welcome back, ${user.name}!`);

      return {
        success: true,
        user
      };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed';

      toast.error(message);

      return {
        success: false,
        message
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);

    delete api.defaults.headers.common['Authorization'];

    toast.info('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const response = await api.put('/api/auth/profile', formData);

      setUser(response.data.user);

      toast.success('Profile updated successfully');

      return {
        success: true
      };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Profile update failed';

      toast.error(message);

      return {
        success: false,
        message
      };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });

      toast.success('Password changed successfully');

      return {
        success: true
      };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Password change failed';

      toast.error(message);

      return {
        success: false,
        message
      };
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
