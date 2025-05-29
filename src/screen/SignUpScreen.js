import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View, Image,
  KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth, db } from '../firebaseConfig'; // your firebase config here
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleEmailSignUp = async () => {
    if (!username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      await setDoc(doc(db, "users", uid), {
        uid,
        username,
        email,
        phoneNumber,
        gender,
        createdAt: new Date().toISOString()
      });

      // Persist login
      await AsyncStorage.setItem("keepLoggedIn", "true");
      await AsyncStorage.setItem("currentUserUid", uid);

      Alert.alert("Success", "Account created successfully!");

      // Navigate to home screen after signup
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Sign-up Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image source={require('../Image/logo.png')} style={styles.logo} />

        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Please Sign Up first to</Text>
          <Text style={[styles.headingText, styles.bukoText]}>Buko</Text>
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your username"
            placeholderTextColor="#000000"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#000000"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your phone number"
            placeholderTextColor="#000000"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#000000"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#003580" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm your password"
            placeholderTextColor="#000000"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#003580" />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>Gender:</Text>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Male' && styles.selectedGender]}
            onPress={() => setGender('Male')}
          >
            <Text style={[styles.genderText, gender === 'Male' && styles.selectedText]}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Female' && styles.selectedGender]}
            onPress={() => setGender('Female')}
          >
            <Text style={[styles.genderText, gender === 'Female' && styles.selectedText]}>Female</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleEmailSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 120,
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 26,
    color: '#003580',
    fontWeight: 'bold',
  },
  bukoText: {
    fontSize: 32,
    color: '#003580',
    fontWeight: '900',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#800080',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 15,
    color: '#003580',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genderLabel: {
    marginRight: 15,
    fontSize: 16,
    color: '#003580',
    fontWeight: 'bold',
  },
  genderButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#003580',
    marginHorizontal: 5,
  },
  selectedGender: {
    backgroundColor: '#800080',
  },
  genderText: {
    color: '#003580',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
});
