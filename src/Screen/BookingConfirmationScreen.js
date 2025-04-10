import React from 'react';
import { View, Button, Text, Alert } from 'react-native';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { bus, seats, from, to, date } = route.params;

  const confirmBooking = () => {
    // Check if user is logged in
    const isLoggedIn = false; // Replace with actual auth check
    
    if (isLoggedIn) {
      // Save booking and navigate to MyBookings
      navigation.navigate('MyBookings');
    } else {
      // Redirect to login with booking data
      navigation.navigate('Login', {
        bookingData: { bus, seats, from, to, date },
        redirectTo: 'MyBookings'
      });
    }
  };

  return (
    <View>
      <Text>Booking Summary</Text>
      <Text>Bus: {bus.name}</Text>
      <Text>Seats: {seats.join(', ')}</Text>
      <Text>From: {from} to {to}</Text>
      <Text>Date: {date}</Text>
      <Button 
        title="Confirm Booking" 
        onPress={confirmBooking} 
      />
    </View>
  );
};

export default BookingConfirmationScreen;