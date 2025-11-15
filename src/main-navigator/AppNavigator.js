import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Parent from './Parent.js';
import { StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import AllUsers from '../Screen/AllUsers.js';
import LoginScreen from '../Screen/Login.js';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  let theme = useTheme();

  const isDarkTheme = theme.colors.background_default === '#000000';
  let barStyle = isDarkTheme ? 'light-content' : 'dark-content';
  let isLogged = true;
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background_default}
        barStyle={barStyle}
      />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Parent"
              component={Parent}
              options={{ animation: 'fade_from_bottom' }}
            />
            <Stack.Screen
              name="Users"
              component={AllUsers}
              options={{ animation: 'fade_from_bottom' }}
            />
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{ animation: 'fade_from_bottom' }}
            />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}  