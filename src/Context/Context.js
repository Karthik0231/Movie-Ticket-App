import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastAndroid, Platform } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const host = 'https://09de6696b690.ngrok-free.app/api';
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [allShows, setAllShows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userJson = await AsyncStorage.getItem('auth_user');
        if (token && userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (err) {
        console.warn('Auth load error', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const signIn = async ({ email, password }) => {
    try {
      const res = await axios.post(`${host}/admin/login`, { email, password }, {
        headers: {
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data && data.success) {
        const token = data.token;
        const userObj = data.admin || data.user || {};
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('auth_user', JSON.stringify({ ...userObj, role: 'admin' }));
        setUser({ ...userObj, role: 'admin' });
        ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        return { success: true };
      } else {
        ToastAndroid.show(data?.message || 'Login failed', ToastAndroid.SHORT);
        return { success: false, message: data?.message };
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Network error';
      console.warn('SignIn error:', errorMsg, err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('auth_user');
    setUser(null);
  };

  // ========== USER MANAGEMENT FUNCTIONS ==========

  const getAllUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.get(`${host}/user/user`, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.warn('Fetch all users error', err);
    }
  };

  const AddUser = async (userData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.post(`${host}/user/user`, userData, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prevUsers => [...prevUsers, data.user]);
        ToastAndroid.show('User added successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Add user failed';
      console.warn('Add user error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.put(`${host}/user/user/${id}`, userData, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prev => prev.map(u => (u._id === id ? data.user : u)));
        ToastAndroid.show('User updated successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Update user failed';
      console.warn('Update user error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.delete(`${host}/user/user/${id}`, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prev => prev.filter(u => u._id !== id));
        ToastAndroid.show('User deleted successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Delete user failed';
      console.warn('Delete user error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const assignCard = async (id, cardId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.post(`${host}/user/user/${id}/assign-card`, { cardId }, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prev => prev.map(u => (u._id === id ? data.user : u)));
        ToastAndroid.show('Card assigned successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Assign card failed';
      console.warn('Assign card error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const toggleCardStatus = async (id, isActive) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.patch(`${host}/user/user/${id}/toggle-status`, { isActive }, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prev => prev.map(u => (u._id === id ? data.user : u)));
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Toggle status failed';
      console.warn('Toggle status error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const rechargeWallet = async (id, amount) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.post(`${host}/user/user/${id}/recharge-wallet`, { amount }, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1'
        }
      });
      const data = res.data;
      if (data.success) {
        setAllUsers(prev => prev.map(u => (u._id === id ? data.user : u)));
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Recharge failed';
      console.warn('Recharge wallet error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  // ========== SHOW MANAGEMENT FUNCTIONS ==========

  const getAllShows = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.get(`${host}/show`, {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1',
        },
      });
      const data = res.data;
      if (data.success) {
        setAllShows(data.shows);
      }
    } catch (err) {
      console.warn('Fetch all shows error', err);
    }
  };

  const AddShow = async (showData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const formData = new FormData();
      Object.entries(showData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.post(`${host}/show`, formData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': '1',
        },
      });
      const data = res.data;
      if (data.success) {
        setAllShows(prevShows => [...prevShows, data.show]);
        ToastAndroid.show('Show added successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Add show failed';
      console.warn('Add show error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const updateShow = async (id, showData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const formData = new FormData();
      Object.entries(showData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await axios.put(`${host}/show/${id}`, formData, {
        headers: {
          'auth-token': token,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': '1',
        },
      });
      const data = res.data;
      if (data.success) {
        setAllShows(prev => prev.map(s => (s._id === id ? data.show : s)));
        ToastAndroid.show('Show updated successfully', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Update show failed';
      console.warn('Update show error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  const deleteShow = async (id) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const res = await axios.delete(`${host}/show/${id}`, {
        headers: { 'auth-token': token, 'ngrok-skip-browser-warning': '1' },
      });
      const data = res.data;
      if (data.success) {
        setAllShows(prev => prev.filter(s => s._id !== id));
        ToastAndroid.show('Show deleted', ToastAndroid.SHORT);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Delete show failed';
      console.warn('Delete show error', err);
      ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      return { success: false, error: err, message: errorMsg };
    }
  };

  // Fetch user by card ID
const getUserByCardId = async (cardId) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    const res = await axios.get(`${host}/user/card/${cardId}`, {
      headers: {
        'auth-token': token,
        'ngrok-skip-browser-warning': '1',
      },
    });
    return res.data;
  } catch (err) {
    console.warn('Get user by card error', err);
    return null;
  }
};

// Fetch all active shows
const getActiveShows = async () => {
  try {
    const res = await axios.get(`${host}/usershow/show/active`, {
      headers: { 'ngrok-skip-browser-warning': '1' },
    });
    if (res.data.success) {
      setAllShows(res.data.shows);
    }
  } catch (err) {
    console.warn('Fetch active shows error', err);
  }
};

// Purchase tickets
const purchaseTickets = async (userId, showId, quantity) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    const res = await axios.post(
      `${host}/usershow/purchase`,
      { userId, showId, quantity },
      {
        headers: {
          'auth-token': token,
          'ngrok-skip-browser-warning': '1',
        },
      }
    );
    return res.data;
  } catch (err) {
    console.warn('Purchase tickets error', err);
    return { success: false, message: 'Purchase failed' };
  }
};


  // Load initial data
  useEffect(() => {
    if (user) {
      getAllUsers();
      getAllShows();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        // User Management
        allUsers,
        getAllUsers,
        AddUser,
        updateUser,
        deleteUser,
        assignCard,
        toggleCardStatus,
        rechargeWallet,
        // Show Management
        allShows,
        getAllShows,
        AddShow,
        updateShow,
        deleteShow,

        // User Functions
        getUserByCardId,
        getActiveShows,
        purchaseTickets,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};