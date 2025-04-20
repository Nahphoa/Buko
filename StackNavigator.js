import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from './src/context/AuthContext';

// Screens
import HomeScreen from './src/Screen/HomeScreen';
import BookingScreen from './src/Screen/BookingScreen';
import ProfileScreen from './src/Screen/ProfileScreen';
import LoginScreen from './src/Screen/LoginScreen';
import SignUpScreen from './src/Screen/SignUpScreen';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';
import SelectRouteScreen from './src/Screen/SelectRouteScreen';
import BusListScreen from './src/Screen/BusListScreen';
import SearchBusScreen from './src/Screen/SearchBusScreen';
import SeatSelectionScreen from './src/Screen/SeatSelectionScreen';
import BookingDetailsScreen from './src/Screen/BookingDetailsScreen';
import PaymentScreen from './src/Screen/PaymentScreen';

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#003580',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
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

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'}>
        {!user ? (
          <>
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
          </>
        ) : null}

        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SelectRouteScreen"
          component={SelectRouteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchBusScreen"
          component={SearchBusScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusListScreen"
          component={BusListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SeatSelectionScreen"
          component={SeatSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingDetailsScreen"
          component={BookingDetailsScreen}
          options={{
            title: 'Booking Details',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTintColor: '#003580',
          }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
