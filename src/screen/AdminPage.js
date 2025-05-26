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

  // Fetch bookings and setup notification listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Booking'), (snapshot) => {
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

    return () => unsubscribe();
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
          <TextInput style={styles.input} placeholder="Available Seats" value={seatsAvailable} keyboardType="numeric" onChangeText={setSeatsAvailable} />

          <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
            <Text style={styles.buttonText}>{editId ? 'Update Bus' : 'Add Bus'}</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Bus List</Text>
          {buses.map((item) => (
            <View key={item.id} style={styles.busItem}>
              <Text>{item.busName} ({item.busNumber})</Text>
              <Text>{item.time} | ₹{item.price} | Seats: {item.seatsAvailable}/{item.totalSeats}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBus(item.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* User Bookings Section */}
      <Text style={styles.subtitle}>Passengers</Text>
      {bookings.length === 0 ? (
        <Text>Not Bookings Yet For This Route.</Text>
      ) : (
        bookings.map((booking) => (
          <View key={booking.id} style={styles.busItem}>
            <Text style={{ fontWeight: 'bold' }}>{booking.name} / Seat: {booking.seatNumber}</Text>
            <Text>Bus: {booking.busName} ({booking.busNumber})</Text>
             

            <Text>Travel Date: {booking.travelDate}</Text>
            
            <TouchableOpacity onPress={() => handleDeleteBooking(booking.id)}>
              <Text style={{ color: 'red', marginTop: 5 }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'darkblue',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000000',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addBusButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  busItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  edit: {
    color: 'green',
  },
  delete: {
    color: 'red',
  },
  notificationBox: {
    backgroundColor: '#ffefc2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: '#28a745',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  notificationBadge: {
    backgroundColor: 'red',
    position: 'absolute',
    right: -6,
    top: -4,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
