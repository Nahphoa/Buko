import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

export default function AdminPage() {
  const [buses, setBuses] = useState([]);
  const [busNumber, setBusNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchBuses = async () => {
    const snapshot = await getDocs(collection(db, 'buses'));
    setBuses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const clearFields = () => {
    setBusNumber('');
    setSource('');
    setDestination('');
    setDate('');
    setTime('');
    setPrice('');
    setSeatsAvailable('');
    setEditId(null);
  };

  const handleAddOrUpdate = async () => {
    if (!busNumber || !source || !destination || !date || !time || !price || !seatsAvailable) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const busData = {
      busNumber,
      source,
      destination,
      date,
      time,
      price: parseFloat(price),
      seatsAvailable: parseInt(seatsAvailable)
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
    setBusNumber(bus.busNumber);
    setSource(bus.source);
    setDestination(bus.destination);
    setDate(bus.date);
    setTime(bus.time);
    setPrice(bus.price.toString());
    setSeatsAvailable(bus.seatsAvailable.toString());
    setEditId(bus.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Buses</Text>

      <TextInput style={styles.input} placeholder="Bus Number" value={busNumber} onChangeText={setBusNumber} />
      <TextInput style={styles.input} placeholder="Source" value={source} onChangeText={setSource} />
      <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
      <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Time (HH:MM AM/PM)" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Price" value={price} keyboardType="numeric" onChangeText={setPrice} />
      <TextInput style={styles.input} placeholder="Seats Available" value={seatsAvailable} keyboardType="numeric" onChangeText={setSeatsAvailable} />

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>{editId ? 'Update Bus' : 'Add Bus'}</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Bus List</Text>

      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.busItem}>
            <Text>{item.busNumber} - {item.source} to {item.destination}</Text>
            <Text>{item.date} at {item.time} | ₹{item.price} | Seats: {item.seatsAvailable}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  busItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  edit: {
    color: 'green'
  },
  delete: {
    color: 'red'
  }
});
