
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const TicketCancel = () => {
  const [bookings, setBookings] = useState([]);
  const db = getFirestore();
  const user = auth.currentUser;

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'Booking'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookingData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'Booking', bookingId));
      Alert.alert('Success', 'Booking cancelled');
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.text}>Bus: {item.busName || item.busNumber}</Text>
              <Text style={styles.text}>Seat: {item.seatNumber}</Text>
              <Text style={styles.text}>Date: {item.travelDate}</Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Cancel Ticket', 'Are you sure?', [
                    { text: 'No' },
                    { text: 'Yes', onPress: () => cancelBooking(item.id) },
                  ])
                }
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel Ticket</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003580',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TicketCancel;
