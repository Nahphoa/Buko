import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const stored = await AsyncStorage.getItem('bookingHistory');
        const parsed = stored ? JSON.parse(stored) : [];
        setBookings(parsed.reverse()); // Show latest first
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = fetchBookings();
    return () => unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.item}>Bus: {item.busName}</Text>
      <Text style={styles.item}>
        From: {item.from} → {item.to}
      </Text>
      <Text style={styles.item}>Date: {item.date}</Text>
      <Text style={styles.item}>Time: {item.time || 'N/A'}</Text>
      <Text style={styles.item}>
        Passenger: {item.passengerDetails.name}, {item.passengerDetails.age},{' '}
        {item.passengerDetails.gender}
      </Text>
      <Text style={styles.item}>
        Seats: {item.selectedSeats?.join(', ') || 'N/A'}
      </Text>
      <Text style={styles.item}>Total: ₹{item.totalPrice}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#003580" />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingText}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  noBookingText: { fontSize: 16, color: '#555', marginTop: 20 },
  bookingCard: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#003580',
  },
  item: { fontSize: 14, marginBottom: 4, color: '#333' },
});

export default BookingScreen;
