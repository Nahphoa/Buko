import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import uuid from 'react-native-uuid';
import { useAuth } from '../context/AuthContext';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { bus, passengers, selectedSeats, totalFare } = route.params || {};
  const [loading, setLoading] = useState(false);

  console.log("Route params:", route.params); // Add this for debugging

  const handlePayment = async () => {
    if (!bus || !passengers || !selectedSeats) {
      Alert.alert('Error', 'Missing booking details');
      return;
    }

    setLoading(true);
    try {
      const bookingId = uuid.v4();

      const bookingData = {
        id: bookingId,
        userId: user?.uid || 'anonymous',
        busId: bus?.busNumber || bus?.number || '',
        busName: bus?.busName || bus?.name || '',
        busNumber: bus?.busNumber || bus?.number || '',
        from: bus?.from || '',
        to: bus?.to || '',
        date: bus?.date || new Date().toISOString().split('T')[0],
        time: bus?.departureTime || bus?.time || '',
        farePerSeat: bus?.fare || bus?.price || 0,
        totalFare: totalFare || 0,
        selectedSeats: Array.isArray(selectedSeats) ? selectedSeats : [],
        passengers: Array.isArray(passengers) ? passengers : [],
        status: 'confirmed',
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'bookings', bookingId), bookingData);

      Alert.alert(
        'Payment Successful', 
        'Your booking has been confirmed.',
        [{ text: 'OK', onPress: () => navigation.navigate('BookingHistory') }]
      );
    } catch (error) {
      console.error('Failed to save booking:', error);
      Alert.alert('Error', 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bus || !passengers || !selectedSeats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No booking details available.</Text>
        <Text style={styles.debugText}>
          Debug: {JSON.stringify({ bus, passengers, selectedSeats })}
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          color="#003580"
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... rest of your JSX remains the same ... */}
    </ScrollView>
  );
};

// Add this to your styles:
const styles = StyleSheet.create({
  // ... your existing styles ...
  debugText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 10,
  },
});

export default BookingConfirmationScreen;