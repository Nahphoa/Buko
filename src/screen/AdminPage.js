import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function AdminPage({ route }) {
  const { source: adminSource, destination: adminDestination } = route.params;

  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [editId, setEditId] = useState(null);
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBusForm, setShowBusForm] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // New state for cancel requests
  const [cancelRequests, setCancelRequests] = useState([]);

  // Fetch buses
  const fetchBuses = async () => {
    const snapshot = await getDocs(collection(db, 'buses'));
    const filtered = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (bus) =>
          bus.source === adminSource && bus.destination === adminDestination
      );
    setBuses(filtered);
  };

  // Fetch cancel requests filtered by route
  const fetchCancelRequests = () => {
    const q = query(
      collection(db, 'CancelRequests'),
      where('source', '==', adminSource),
      where('destination', '==', adminDestination),
      where('status', '==', 'pending')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCancelRequests(requests);
    });
  };

  // Fetch bookings and setup notification listener
  useEffect(() => {
    const unsubscribeBookings = onSnapshot(collection(db, 'Booking'), (snapshot) => {
      const updatedBookings = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (booking) =>
            booking.from === adminSource &&
            booking.to === adminDestination
        );

      // Detect new bookings
      if (updatedBookings.length > bookings.length) {
        setNotifications((prev) => [
          ...prev,
          `New ticket booking (${updatedBookings.length - bookings.length})`,
        ]);
      } else if (updatedBookings.length < bookings.length) {
        setNotifications((prev) => [...prev, 'Ticket cancelled']);
      }

      setBookings(updatedBookings);
    });

    fetchBuses();
    const unsubscribeCancelRequests = fetchCancelRequests();

    return () => {
      unsubscribeBookings();
      unsubscribeCancelRequests();
    };
  }, []);

  const clearFields = () => {
    setBusName('');
    setBusNumber('');
    setTime('');
    setPrice('');
    setTotalSeats('');
    setSeatsAvailable('');
    setEditId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!busName || !busNumber || !time || !price || !totalSeats || !seatsAvailable) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const busData = {
      busName,
      busNumber,
      source: adminSource,
      destination: adminDestination,
      time,
      price: parseFloat(price),
      totalSeats: parseInt(totalSeats),
      seatsAvailable: parseInt(seatsAvailable),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'buses', editId), busData);
        Alert.alert('Updated', 'Bus updated successfully');
      } else {
        await addDoc(collection(db, 'buses'), busData);
        Alert.alert('Added', 'Bus added successfully');
      }
      clearFields();
      fetchBuses();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      await deleteDoc(doc(db, 'buses', id));
      Alert.alert('Deleted', 'Bus deleted successfully');
      fetchBuses();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, 'Booking', id));
      Alert.alert('Deleted', 'Booking deleted successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEdit = (bus) => {
    setBusName(bus.busName);
    setBusNumber(bus.busNumber);
    setTime(bus.time);
    setPrice(bus.price.toString());
    setTotalSeats(bus.totalSeats.toString());
    setSeatsAvailable(bus.seatsAvailable.toString());
    setEditId(bus.id);
  };

  // New: Approve cancel request
  const handleApproveCancelRequest = async (request) => {
    try {
      // Find booking matching passenger and route info
      const q = query(
        collection(db, 'Booking'),
        where('name', '==', request.passengerName),
        where('phone', '==', request.phone), // assuming phone stored in booking
        where('from', '==', adminSource),
        where('to', '==', adminDestination)
      );
      const bookingSnapshot = await getDocs(q);

      // Delete all matching bookings (usually one)
      bookingSnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, 'Booking', docSnap.id));
      });

      // Remove cancel request document
      await deleteDoc(doc(db, 'CancelRequests', request.id));

      Alert.alert('Success', `Cancelled ticket for ${request.passengerName}`);

      // Remove request from local state
      setCancelRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      Alert.alert('Error', 'Failed to approve cancel request: ' + error.message);
    }
  };

  // New: Reject cancel request (just delete the request)
  const handleRejectCancelRequest = async (requestId) => {
    try {
      await deleteDoc(doc(db, 'CancelRequests', requestId));
      Alert.alert('Request Rejected');
      setCancelRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      Alert.alert('Error', 'Failed to reject cancel request: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>ADMIN: {adminSource} ➡️ {adminDestination}</Text>
        <TouchableOpacity onPress={() => setNotifications([])}>
          <Ionicons name="notifications" size={28} color="green" />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={{ color: 'white', fontSize: 10 }}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification messages */}
      {notifications.length > 0 && (
        <View style={styles.notificationBox}>
          {notifications.map((note, idx) => (
            <Text key={idx}>{note}</Text>
          ))}
          <TouchableOpacity style={styles.okButton} onPress={() => setNotifications([])}>
            <Text style={{ color: 'white' }}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Bus Section */}
      <TouchableOpacity
        style={styles.addBusButton}
        onPress={() => setShowBusForm(!showBusForm)}
      >
        <Text style={styles.buttonText}>{showBusForm ? 'Hide Add Bus' : 'Add Bus'}</Text>
      </TouchableOpacity>

      {showBusForm && (
        <View>
          <TextInput style={styles.input} placeholder="Bus Name" value={busName} onChangeText={setBusName} />
          <TextInput style={styles.input} placeholder="Bus Number" value={busNumber} onChangeText={setBusNumber} />
          <TextInput style={styles.input} placeholder="Time (HH:MM AM/PM)" value={time} onChangeText={setTime} />
          <TextInput style={styles.input} placeholder="Price" value={price} keyboardType="numeric" onChangeText={setPrice} />
          <TextInput style={styles.input} placeholder="Total Seats" value={totalSeats} keyboardType="numeric" onChangeText={setTotalSeats} />
          <TextInput style={styles.input} placeholder="Seats Available" value={seatsAvailable} keyboardType="numeric" onChangeText={setSeatsAvailable} />

          <TouchableOpacity style={styles.addBusButton} onPress={handleAddOrUpdate}>
            <Text style={styles.buttonText}>{editId ? 'Update Bus' : 'Add Bus'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bus List */}
      <Text style={styles.sectionTitle}>Buses:</Text>
      {buses.length === 0 && <Text>No buses available.</Text>}
      {buses.map((bus) => (
        <View key={bus.id} style={styles.listItem}>
          <Text style={{ fontWeight: 'bold' }}>{bus.busName} ({bus.busNumber})</Text>
          <Text>Time: {bus.time}</Text>
          <Text>Price: ₹{bus.price}</Text>
          <Text>Seats: {bus.seatsAvailable}/{bus.totalSeats}</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleEdit(bus)}>
              <Ionicons name="create-outline" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteBus(bus.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Bookings List */}
      <Text style={styles.sectionTitle}>User Bookings:</Text>
      {bookings.length === 0 && <Text>No bookings yet.</Text>}
      {bookings.map((booking) => (
        <View key={booking.id} style={styles.listItem}>
          <Text style={{ fontWeight: 'bold' }}>{booking.busName || booking.busNumber}</Text>
          <Text>Passenger: {booking.name}</Text>
          <Text>Seat: {booking.seat}</Text>
          <Text>Date: {booking.date}</Text>
          <Text>Time: {booking.time}</Text>
          <TouchableOpacity onPress={() => handleDeleteBooking(booking.id)}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Cancel Ticket Requests */}
      <Text style={styles.sectionTitle}>Cancel Ticket Requests:</Text>
      {cancelRequests.length === 0 && <Text>No cancel requests.</Text>}
      {cancelRequests.map((request) => (
        <View key={request.id} style={styles.cancelRequestItem}>
          <Text style={{ fontWeight: 'bold' }}>Passenger: {request.passengerName}</Text>
          <Text>Phone: {request.phone}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.approveButton]}
              onPress={() => handleApproveCancelRequest(request)}
            >
              <Text style={{ color: 'white' }}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rejectButton]}
              onPress={() => handleRejectCancelRequest(request.id)}
            >
              <Text style={{ color: 'white' }}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontWeight: 'bold', fontSize: 18 },
  notificationBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    position: 'absolute',
    right: -6,
    top: -4,
  },
  notificationBox: {
    backgroundColor: '#e7f3fe',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  okButton: {
    backgroundColor: 'green',
    padding: 6,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addBusButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
  },
  listItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  cancelRequestItem: {
    borderWidth: 1,
    borderColor: '#ff6666',
    backgroundColor: '#ffe6e6',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
});
