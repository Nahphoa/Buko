import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const UpdateTicket = () => {
  const [bookings, setBookings] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState(new Date());

  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    const q = query(collection(db, 'Booking'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBookings(data);
  };

  const handleDateChange = async (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewDate(selectedDate);
      if (selectedBooking) {
        await sendUpdateRequest(selectedBooking, selectedDate);
        setSelectedBooking(null);
      }
    }
  };

  const sendUpdateRequest = async (booking, newTravelDate) => {
    try {
      await addDoc(collection(db, 'UpdateRequests'), {
        userId: user.uid,
        bookingId: booking.id,
        busNumber: booking.busNumber,
        currentDate: booking.travelDate,
        requestedDate: newTravelDate.toISOString().split('T')[0],
        status: 'pending',
        route: booking.route,
        requestedAt: new Date().toISOString(),
      });
      Alert.alert('Request Sent', 'Your update request has been sent to the admin.');
    } catch (error) {
      console.error('Error sending update request:', error);
      Alert.alert('Error', 'Failed to send update request.');
    }
  };

  const openDatePicker = (booking) => {
    setSelectedBooking(booking);
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update Travel Date</Text>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Bus: {item.busNumber}</Text>
            <Text style={styles.text}>Date: {item.travelDate}</Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => openDatePicker(item)}
            >
              <Text style={styles.buttonText}>Update Date</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {showDatePicker && (
        <DateTimePicker
          value={newDate}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
  },
  text: { fontSize: 16 },
  updateButton: {
    marginTop: 8,
    backgroundColor: '#003580',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff' },
});

export default UpdateTicket;
