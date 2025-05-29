import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

// Screens or Stacks
import HomeScreen from './src/screen/HomeScreen';
import BookingScreen from './src/screen/BookingScreen';
import ProfileScreen from './src/screen/ProfileScreen';

const Tab = createBottomTabNavigator();

// Helper function to control tab bar visibility
const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMenu';

  if (
    routeName === 'LoginScreen' ||
    routeName === 'Signup' ||
    routeName === 'ForgotPassword' ||
    routeName === 'AdminLogin' ||
    routeName === 'AdminSignup' ||
    routeName === 'AdminPage'
  ) {
    return 'none';
  }

  return 'flex';
};

const MainTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#800080" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="ticket" size={24} color="#800080" />
            ) : (
              <Ionicons name="ticket-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({
          tabBarLabel: 'Profile',
          tabBarStyle: {
            display: getTabBarVisibility(route),
          },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#800080" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        })}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
