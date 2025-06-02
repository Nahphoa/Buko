import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const CancelTicketRequestScreen = ({ navigation }) => {
  const [passengerName, setPassengerName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleCancelRequest = async () => {
    if (!passengerName || !phone || !source || !destination) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'CancelRequests'), {
        passengerName,
        phone,
        source: source.trim().toLowerCase(),
        destination: destination.trim().toLowerCase(),
        requestTime: Timestamp.now(),
        status: 'pending',
      });

      Alert.alert('Success', 'Your cancellation request has been sent to the admin.');
      setPassengerName('');
      setPhone('');
      setSource('');
      setDestination('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to send request: ' + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cancel Ticket Request</Text>

        <TextInput
          style={styles.input}
          placeholder="Passenger Name"
          value={passengerName}
          onChangeText={setPassengerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Source (e.g., Mon)"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination (e.g., Kohima)"
          value={destination}
          onChangeText={setDestination}
        />

        <TouchableOpacity style={styles.button} onPress={handleCancelRequest}>
          <Text style={styles.buttonText}>Send Request to Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CancelTicketRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#003580',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
