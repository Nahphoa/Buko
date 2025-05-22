// src/navigation/BottomTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../Screen/HomeScreen';
import BookingHistoryScreen from '../Screen/BookingHistoryScreen';
import ProfileScreen from '../Screen/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#003580',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          paddingTop: 5,
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            return focused ? (
              <Entypo name="home" size={size} color={color} />
            ) : (
              <AntDesign name="home" size={size} color={color} />
            );
          } else if (route.name === 'BookingHistory') {
            return focused ? (
              <Entypo name="ticket" size={size} color={color} />
            ) : (
              <Ionicons name="ticket-outline" size={size} color={color} />
            );
          } else if (route.name === 'Profile') {
            return focused ? (
              <Ionicons name="person" size={size} color={color} />
            ) : (
              <Ionicons name="person-outline" size={size} color={color} />
            );
          }

          return null;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
