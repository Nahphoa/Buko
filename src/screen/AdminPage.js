import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Image,
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

export default function AdminPage({ route, navigation }) {
  const { source, destination } = route.params ?? {};

  React.useEffect(() => {
    if (!source || !destination) {
      console.warn('Missing source or destination params');
    }
  }, [source, destination]);

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
  const [cancelRequests, setCancelRequests] = useState([]);

  const fetchBuses = async () => {
    const snapshot = await getDocs(collection(db, 'buses'));
    const filtered = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (bus) =>
          bus.source === source && bus.destination === destination
      );
    setBuses(filtered);
  };

  const fetchCancelRequests = () => {
    const q = query(
      collection(db, 'CancelRequests'),
      where('source', '==', source),
      where('destination', '==', destination),
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

  useEffect(() => {
    const unsubscribeBookings = onSnapshot(collection(db, 'Booking'), (snapshot) => {
      const updatedBookings = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (booking) =>
            booking.from === source &&
            booking.to === destination
        );

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
  }, [source, destination]);

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
      source: source,
      destination: destination,
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
    setShowBusForm(true);
  };

  const handleApproveCancelRequest = async (request) => {
    try {
      const q = query(
        collection(db, 'Booking'),
        where('name', '==', request.passengerName),
        where('phone', '==', request.phone),
        where('from', '==', source),
        where('to', '==', destination)
      );
      const bookingSnapshot = await getDocs(q);

      bookingSnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, 'Booking', docSnap.id));
      });

      await deleteDoc(doc(db, 'CancelRequests', request.id));

      Alert.alert('Success', `Cancelled ticket for ${request.passengerName}`);
      setCancelRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      Alert.alert('Error', 'Failed to approve cancel request: ' + error.message);
    }
  };

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
    <ScrollView contentContainerStyle={styles.container}>
     <TouchableOpacity onPress={() => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    // Optional: handle the case where you can't go back
    navigation.navigate('MainTab'); // or any other default screen
  }
}}>
  <Ionicons name="arrow-back" size={28} color="#333" />
</TouchableOpacity>


      {/* Admin Profile */}
      <View style={styles.adminProfile}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
          style={styles.adminAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.adminName}>Admin Name</Text>
          <Text style={styles.adminInfo}>admin@example.com</Text>
          <Text style={styles.adminInfo}>+91 9876543210</Text>
        </View>
      </View>

      {/* Notifications */}
      {notifications.length > 0 && (
        <View style={styles.notificationBox}>
          {notifications.map((note, idx) => (
            <Text key={idx} style={styles.notificationText}>{note}</Text>
          ))}
          <TouchableOpacity style={styles.okButton} onPress={() => setNotifications([])}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bus Form Toggle */}
      <TouchableOpacity
        style={styles.addBusButton}
        onPress={() => setShowBusForm(!showBusForm)}
      >
        <Text style={styles.buttonText}>{showBusForm ? 'Hide Bus Form' : 'Add Bus'}</Text>
      </TouchableOpacity>

      {/* Bus Form */}
      {showBusForm && (
        <View style={styles.busForm}>
          <TextInput style={styles.input} placeholder="Bus Name" value={busName} onChangeText={setBusName} />
          <TextInput style={styles.input} placeholder="Bus Number" value={busNumber} onChangeText={setBusNumber} />
          <TextInput style={styles.input} placeholder="Time" value={time} onChangeText={setTime} />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Total Seats"
            value={totalSeats}
            onChangeText={setTotalSeats}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Seats Available"
            value={seatsAvailable}
            onChangeText={setSeatsAvailable}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={styles.addBusButton} onPress={handleAddOrUpdate}>
              <Text style={styles.buttonText}>{editId ? 'Update Bus' : 'Add Bus'}</Text>
            </TouchableOpacity>
            {editId && (
              <TouchableOpacity
                style={[styles.addBusButton, styles.cancelButton]}
                onPress={clearFields}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Buses Section */}
      <Text style={styles.sectionTitle}>Buses</Text>
      {buses.length === 0 && <Text style={styles.emptyText}>No buses found for this route.</Text>}
      {buses.map((bus) => (
        <View key={bus.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.busName}>{bus.busName}</Text>
            <Text style={styles.busNumber}>{bus.busNumber}</Text>
          </View>
          <Text><Text style={styles.boldText}>Time:</Text> {bus.time}</Text>
          <Text><Text style={styles.boldText}>Price:</Text> ₹{bus.price}</Text>
          <Text><Text style={styles.boldText}>Seats:</Text> {bus.seatsAvailable} / {bus.totalSeats}</Text>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleEdit(bus)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() =>
                Alert.alert('Confirm Delete', 'Are you sure you want to delete this bus?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBus(bus.id) },
                ])
              }
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Bookings Section */}
      <Text style={styles.sectionTitle}>Bookings</Text>
      {bookings.length === 0 && <Text style={styles.emptyText}>No bookings found for this route.</Text>}
      {bookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.passengerName}>{booking.name}</Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButtonSmall]}
              onPress={() =>
                Alert.alert('Confirm Delete', 'Delete this booking?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBooking(booking.id) },
                ])
              }
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text>Passenger Name: {booking.username || "Unknown"}</Text>
          <Text><Text style={styles.boldText}>Seat Number:</Text> {booking.seatNumber}</Text>
          <Text>Travel Date: {booking.travelDate || "Not Provided"}</Text>
          <Text><Text style={styles.boldText}>Bus:</Text> {booking.busName || 'N/A'} ({booking.busNumber || 'N/A'})</Text>
          <Text><Text style={styles.boldText}>Phone:</Text> {booking.phone || 'N/A'}</Text>
        </View>
      ))}

      {/* Cancel Requests Section */}
      <Text style={styles.sectionTitle}>Cancel Requests</Text>
      {cancelRequests.length === 0 && <Text style={styles.emptyText}>No pending cancel requests.</Text>}
      {cancelRequests.map((request) => (
        <View key={request.id} style={styles.card}>
          <Text style={styles.passengerName}>{request.passengerName}</Text>
          <Text><Text style={styles.boldText}>Phone:</Text> {request.phone}</Text>
          <Text><Text style={styles.boldText}>Seat Number:</Text> {request.seatNumber}</Text>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApproveCancelRequest(request)}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectCancelRequest(request.id)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f7f8fa',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
  },
  notificationBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 18,
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
    adminProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  adminAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },

  adminName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },

  adminInfo: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },

  notificationBox: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  notificationText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 5,
  },

  okButton: {
    backgroundColor: '#856404',
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  addBusButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  busForm: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },

  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  busName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2c3e50',
  },

  busNumber: {
    fontWeight: '600',
    fontSize: 16,
    color: '#34495e',
  },

  passengerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#34495e',
  },

  boldText: {
    fontWeight: '600',
    color: '#555',
  },

  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },

  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },

  editButton: {
    backgroundColor: '#3498db',
  },

  deleteButton: {
    backgroundColor: '#e74c3c',
  },

  deleteButtonSmall: {
    backgroundColor: '#e74c3c',
    padding: 6,
    borderRadius: 6,
  },

  approveButton: {
    backgroundColor: '#27ae60',
  },

  rejectButton: {
    backgroundColor: '#c0392b',
  },
});
