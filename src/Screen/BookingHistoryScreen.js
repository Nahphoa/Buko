// src/Screen/BookingHistoryScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const BookingHistoryScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        const fetched = snapshot.docs.map(doc => doc.data());
        setBookings(fetched);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const renderPassengerList = (passengers, selectedSeats) => {
    if (!Array.isArray(passengers)) return null;

    return passengers.map((p, idx) => (
      <Text key={idx} style={styles.item}>
        {p.name} ({p.age}, {p.gender}) - Seat: {selectedSeats?.[idx] || 'N/A'}
      </Text>
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.item}>Bus: {item.bus?.name || 'Unknown'}</Text>
      <Text style={styles.item}>
        From: {item.bus?.from || 'N/A'} → {item.bus?.to || 'N/A'}
      </Text>
      <Text style={styles.item}>
        Date: {item.bus?.date || 'N/A'} at {item.bus?.time || 'N/A'}
      </Text>

      <Text style={[styles.item, { marginTop: 4, fontWeight: '600' }]}>
        Passengers:
      </Text>
      {renderPassengerList(item.passengers, item.selectedSeats)}

      <Text style={styles.item}>Total Fare: ₹{item.totalFare}</Text>
      <Text style={styles.item}>Status: {item.status || 'N/A'}</Text>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#003580',
    textAlign: 'center',
  },
  noBookingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#003580',
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
});

export default BookingHistoryScreen;
