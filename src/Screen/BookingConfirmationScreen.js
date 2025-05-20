// src/Screen/BookingConfirmationScreen.js

import React from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import uuid from 'react-native-uuid';
import { useAuth } from '../context/AuthContext';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { bus, passengers, selectedSeats, totalFare } = route.params || {};

  const handlePayment = async () => {
    try {
      const bookingId = uuid.v4();

      const bookingData = {
        id: bookingId,
        userId: user?.uid || null,
        userEmail: user?.email || null,
        busName: bus?.busName,
        busNumber: bus?.busNumber || '',
        from: bus?.departureStation,
        to: bus?.arrivalStation,
        date: bus?.departureDate,
        time: bus?.departureTime,
        passengers,
        selectedSeats,
        totalFare,
        status: 'confirmed',
        createdAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'bookings', bookingId), bookingData);

      Alert.alert('Payment Successful', 'Your booking has been confirmed.');

      navigation.navigate('BookingHistory', {
        booking: bookingData,
        status: 'confirmed',
      });
    } catch (error) {
      console.error('Failed to save booking:', error);
      Alert.alert('Error', 'Failed to confirm booking. Please try again.');
    }
  };

  if (!bus || !passengers || !selectedSeats) {
    return (
      <View style={styles.centered}>
        <Text>Missing booking details.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Confirm Your Booking</Text>

      {/* Bus Info */}
      <Text style={styles.subHeader}>Bus Details</Text>
      <Text>Bus Name: {bus?.busName || '-'}</Text>
      <Text>Bus Number: {bus?.busNumber || '-'}</Text>
      <Text>From: {bus?.departureStation}</Text>
      <Text>To: {bus?.arrivalStation}</Text>
      <Text>Departure: {bus?.departureDate} at {bus?.departureTime}</Text>

      {/* Passenger Info */}
      <Text style={styles.subHeader}>Passenger Details</Text>
      {Array.isArray(passengers) ? (
        passengers.map((p, index) => (
          <View key={index} style={styles.passengerBox}>
            <Text>Name: {p.name}</Text>
            <Text>Age: {p.age}</Text>
            <Text>Gender: {p.gender}</Text>
            <Text>Seat: {selectedSeats[index]}</Text>
          </View>
        ))
      ) : (
        <View style={styles.passengerBox}>
          <Text>Name: {passengers?.name}</Text>
          <Text>Seat: {selectedSeats.join(', ')}</Text>
        </View>
      )}

      {/* Fare Summary */}
      <Text style={styles.subHeader}>Fare Summary</Text>
      <Text>Total Fare: ₹{totalFare}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Confirm & Pay"
          onPress={handlePayment}
          color="#003580"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003580',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#003580',
  },
  passengerBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  buttonContainer: {
    marginTop: 25,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookingConfirmationScreen;
