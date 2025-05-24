import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AdminSignup({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const SECRET_ADMIN_KEY = 'ADM-CNL123'; // required to authorize signup

  const handleSignUp = async () => {
    if (
      !username || !email || !phone || !password ||
      !confirmPassword || !dob || !gender || !source || !destination || !adminKey
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (adminKey !== SECRET_ADMIN_KEY) {
      Alert.alert('Error', 'Invalid admin key');
      return;
    }

    try {
      await addDoc(collection(db, 'admins'), {
        username,
        email,
        phone,
        password, // ⚠️ Don't store plain passwords in production
        dob,
        gender,
        source,
        destination,
        adminKey // saving what user entered
      });

      Alert.alert('Success', 'Admin registered successfully');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Please Sign Up as Admin</Text>

      <TextInput style={styles.input} placeholder="Enter your username" onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Enter your phone number" onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Enter your password" onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm your password" onChangeText={setConfirmPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Date of Birth (DD/MM/YYYY)" onChangeText={setDob} />

      <View style={styles.genderContainer}>
        <Text style={{ fontSize: 16 }}>Gender:</Text>
        <TouchableOpacity onPress={() => setGender('Male')} style={[styles.genderBtn, gender === 'Male' && styles.selectedGender]}>
          <Text>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('Female')} style={[styles.genderBtn, gender === 'Female' && styles.selectedGender]}>
          <Text>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Source" onChangeText={setSource} />
      <TextInput style={styles.input} placeholder="Destination" onChangeText={setDestination} />
      <TextInput style={styles.input} placeholder="Enter Admin Key" onChangeText={setAdminKey} />

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.loginLink}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#4de2c3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  genderBtn: {
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  selectedGender: {
    borderColor: 'blue',
  },
  signupBtn: {
    backgroundColor: '#003366',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#003366',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});
