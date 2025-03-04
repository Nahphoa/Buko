import { 
  StyleSheet, Text, TextInput, TouchableOpacity, View, Image, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For Facebook and Google icons
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

    console.log("Firebase Auth:", auth);
    
  const handleEmailSignUp = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate('Login'); // Redirect to login screen
      })
      .catch((error) => Alert.alert("Sign-up Error", error.message));
  };

  const sendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a valid phone number!");
      return;
    }

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, null);
      setVerificationId(verificationId);
      Alert.alert("OTP Sent", "A verification code has been sent to your phone.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Verify OTP for Phone Sign-Up
  const verifyOTP = async () => {
    if (!verificationCode) {
      Alert.alert("Error", "Please enter the OTP code!");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      Alert.alert("Success", "Phone number verified! Account created.");
      navigation.navigate('Login'); // Redirect to login screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.headingText, { marginLeft: 25 }]}>Let's get</Text>
          <Text style={styles.headingText}>started with</Text>
          <Text style={[styles.headingText, { marginLeft: 47 }]}>Buko</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry={true}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={24} color="#003580" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleEmailSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Social Login Buttons */}
        <View style={styles.socialLoginContainer}>
          {/* Login with Google */}
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#DB4437" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>

          {/* Login with Facebook */}
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#4267B2" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Sign Up with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4C4',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 130,
    marginBottom: 2,
  },
  textContainer: {
    alignSelf: 'flex-end',
    bottom: 130
  },
  headingText: {
    fontSize: 32,
    color: '#003580',
    fontFamily: 'sans-serif-medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 15,
  },
  textInput: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#003580',
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#003580',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 10,
    color: '#003580',
    textDecorationLine: 'underline',
  },
});
