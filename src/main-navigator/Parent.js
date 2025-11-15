import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import AdminTabs from './AdminTabs';
import Login from '../Screen/Login';
import { AuthContext } from '../Context/Context';
import Home from '../Screen/index';

const Parent = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <ActivityIndicator />;

  const role = user?.role || 'user';
  return <>{user ? <AdminTabs /> : <Home />}</>;
};

export default Parent;