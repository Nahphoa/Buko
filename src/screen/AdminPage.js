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
} from 'firebase/firestore';

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

  useEffect(() => {
    fetchBuses();
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'buses', id));
      Alert.alert('Deleted', 'Bus deleted successfully');
      fetchBuses();
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
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Admin of {adminSource} ➡️ {adminDestination}</Text>
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
      </View>

      {buses.map((item) => (
        <View key={item.id} style={styles.busItem}>
          <Text>{item.busName} ({item.busNumber})</Text>
          <Text>{item.time} | ₹{item.price} | Seats: {item.seatsAvailable}/{item.totalSeats}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
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
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
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
  },
  edit: {
    color: 'green',
  },
  delete: {
    color: 'red',
  },
});
