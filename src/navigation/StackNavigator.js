// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

// Screens
import HomeScreen from '../Screen/HomeScreen';
import LoginScreen from '../Screen/LoginScreen';
import SignUpScreen from '../Screen/SignUpScreen';
import ForgotPasswordScreen from '../Screen/ForgotPasswordScreen';
import SelectRouteScreen from '../Screen/SelectRouteScreen';
import SearchBusScreen from '../Screen/SearchBusScreen';
import BusListScreen from '../Screen/BusListScreen';
import SeatSelectionScreen from '../Screen/SeatSelectionScreen';
import PassengerDetailsScreen from '../Screen/PassengerDetailsScreen';
import BookingDetailsScreen from '../Screen/BookingDetailsScreen';
import PaymentScreen from '../Screen/PaymentScreen';
import BookingConfirmationScreen from '../Screen/BookingConfirmationScreen';
import BookingHistoryScreen from '../Screen/BookingHistoryScreen';

// Bottom Tabs
import BottomTabs from './BottomTabs';

// Auth Context
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003580" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Main" : "Home"}>
        {/* Public Screens */}
        {!user && (
          <>
          <Stack.Screen name='Main' component={BottomTabs} options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        )}

        {/* Main App */}
        {user && (
          <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        )}

        {/* Booking Flow */}
        <Stack.Screen name="SelectRouteScreen" component={SelectRouteScreen} options={{ title: 'Select Route', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="SearchBusScreen" component={SearchBusScreen} options={{ title: 'Search Buses', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="BusListScreen" component={BusListScreen} options={{ title: 'Available Buses', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="SeatSelectionScreen" component={SeatSelectionScreen} options={{ title: 'Select Seats', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="PassengerDetails" component={PassengerDetailsScreen} options={{ title: 'Passenger Details', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="BookingDetailsScreen" component={BookingDetailsScreen} options={{ title: 'Booking Details', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: 'Make Payment', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
        <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} options={{ title: 'Booking Confirmed', headerTitleAlign: 'center', headerTintColor: '#003580', headerLeft: () => null }} />
        <Stack.Screen name="BookingHistoryScreen" component={BookingHistoryScreen} options={{ title: 'My Bookings', headerTitleAlign: 'center', headerTintColor: '#003580' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
