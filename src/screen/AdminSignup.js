// screens/AdminSignupScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';

export default function AdminSignup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const handleSignup = async () => {
    if (
      !name || !email || !password || !gender || !phone ||
      !source || !destination || !adminKey
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (source === destination) {
      Alert.alert('Error', 'Source and destination cannot be the same');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'admins'), {
        uid: user.uid,
        name,
        email,
        gender,
        phone,
        source,
        destination,
        adminKey,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Admin account created');
      navigation.replace('AdminPage', { source, destination });
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
     
    <View style={styles.container}>
      <Text style={styles.header}>Admin Signup</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Source" value={source} onChangeText={setSource} />
      <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
      <TextInput style={styles.input} placeholder="Admin Key" value={adminKey} onChangeText={setAdminKey} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

       <TouchableOpacity onPress={() => navigation.navigate('AdminLog')}>
        <Text style={styles.loginLink}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003580',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderColor: '#000000',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#800080',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
  color: '#003366',
  marginTop: 15,
  textDecorationLine: 'underline',
  textAlign: 'center',
  },
});
