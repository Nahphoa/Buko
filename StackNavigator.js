import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/Screen/HomeScreen';
import BookingScreen from './src/Screen/BookingScreen';
import ProfileScreen from './src/Screen/ProfileScreen';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoginScreen from './src/Screen/LoginScreen';
import SignUpScreen from './src/Screen/SignUpScreen';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import SelectRouteScreen from './src/Screen/SelectRouteScreen';
import BusListScreen from './src/Screen/BusListScreen';
import SearchBusScreen from './src/Screen/SearchBusScreen';
import SeatSelectionScreen from './src/Screen/SeatSelectionScreen';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

// BottomTabs component (integrated directly into StackNavigator)
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#003580', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarStyle: {
          paddingBottom: 5, // Add padding to the bottom
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#003580" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Booking',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="ticket" size={24} color="#003580" />
            ) : (
              <Ionicons name="ticket-outline" size={24} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="person" size={24} color="#003580" />
            ) : (
              <Ionicons name="person-outline" size={24} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

// StackNavigator component
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        {/* Main screen (BottomTabs) */}
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* Authentication screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />

        {/* Other screens */}
        <Stack.Screen
          name="SelectRouteScreen"
          component={SelectRouteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusListScreen"
          component={BusListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchBusScreen"
          component={SearchBusScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeatSelectionScreen"
          component={SeatSelectionScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});