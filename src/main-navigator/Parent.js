import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Home from '../Screen/index';

const Parent = () => {
  let user={
    name: 'John',
  }; //full data of user
  let role = 'user';
  const navigation = useNavigation();
  if (!user) {
    return <ActivityIndicator />;
  }
  return <>{role == 'admin' ? <Home /> : <Home />}</>;
};

export default Parent;