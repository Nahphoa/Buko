import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const handleLogin = async () => {
    if (!email || !password || !source || !destination || !adminKey) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Step 1: Authenticate using Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Query Firestore for the admin profile
      const adminRef = collection(db, 'admins');
      const q = query(
        adminRef,
        where('uid', '==', user.uid),
        where('source', '==', source),
        where('destination', '==', destination),
        where('adminKey', '==', adminKey)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Login Failed', 'No admin profile found with matching route and key');
        return;
      }

      const adminDoc = snapshot.docs[0].data();

      // Step 3: Navigate to AdminPage (Firebase handles session persistence)
      Alert.alert('Success', 'Login successful!');

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AdminPage',
            params: {
              source: adminDoc.source,
              destination: adminDoc.destination,
            },
          },
        ],
      });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        onChangeText={setPassword}
        secureTextEntry
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter source"
        onChangeText={setSource}
        value={source}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter destination"
        onChangeText={setDestination}
        value={destination}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Admin Key"
        onChangeText={setAdminKey}
        value={adminKey}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AdminSign')}>
        <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
  loginBtn: {
    backgroundColor: '#800080',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#003366',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});
