// src/navigation/BottomTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import HomeScreen from '../Screen/HomeScreen';
import BookingHistoryScreen from '../Screen/BookingHistoryScreen';
import ProfileScreen from '../Screen/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#003580',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { 
          paddingBottom: 5, 
          height: 60,
          paddingTop: 5
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Entypo name="home" size={size} color={color} />
            ) : (
              <AntDesign name="home" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen
        name="BookingHistory"
        component={BookingHistoryScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Entypo name="ticket" size={size} color={color} />
            ) : (
              <Ionicons name="ticket-outline" size={size} color={color} />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Ionicons name="person" size={size} color={color} />
            ) : (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}