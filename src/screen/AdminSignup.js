import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function AdminSignup({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [adminKey, setAdminKey] = useState('');

  const handleSignup = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !gender ||
      !phoneNumber ||
      !source ||
      !destination ||
      !adminKey
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
        username,
        email,
        gender,
        phoneNumber,
        source,
        destination,
        adminKey,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Admin account created');
      navigation.replace('AdminLog');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  const handlePhoneChange = (value) => {
    const numeric = value.replace(/[^0-9]/g, '');
    if (numeric.length <= 10) {
      setPhoneNumber(numeric);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Admin Signup</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {[
            { label: 'Male ♂️', value: 'Male' },
            { label: 'Female ♀️', value: 'Female' },
            { label: 'Other ⚧️', value: 'Other' },
          ].map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.genderButton, gender === value && styles.genderButtonSelected]}
              onPress={() => setGender(value)}
            >
              <Text style={[styles.genderText, gender === value && styles.genderTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Source"
          value={source}
          onChangeText={setSource}
        />
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Admin Key"
          value={adminKey}
          onChangeText={setAdminKey}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('AdminLog')}>
          <Text style={styles.loginLink}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    marginBottom: 70,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003580',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    color: '#000',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#800080',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#800080',
  },
  genderText: {
    color: '#800080',
    fontWeight: 'bold',
  },
  genderTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#800080',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
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
