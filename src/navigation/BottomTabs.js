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
          if (route.name === 'Home') {
            return focused ? (
              <Entypo name="home" size={size} color={color} />
            ) : (
              <AntDesign name="home" size={size} color={color} />
            );
          } else if (route.name === 'Bookings') {
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
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
