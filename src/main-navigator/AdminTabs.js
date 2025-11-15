import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../Screen/index';
import AllUsers from '../Screen/AllUsers';
import { View, Text } from 'react-native';
import AllShows from '../Screen/AllShows';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Settings</Text>
    </View>
  );
}

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
        // tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 10,
          marginBottom: 10,
          height: 60,
          borderRadius: 15,
          paddingBottom: 5,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Users') iconName = 'account-group';
          else if (route.name === 'Shows') iconName = 'movie-open-outline';
          else if (route.name === 'Bookings') iconName = 'calendar-check';
          return <MaterialCommunityIcons name={iconName} color={color} size={size + 2} />;
        },
      })}
    >
      <Tab.Screen name="Users" component={AllUsers} />
      <Tab.Screen name="Shows" component={AllShows} />
      <Tab.Screen name="Bookings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
