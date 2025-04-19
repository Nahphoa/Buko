import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation, route }) => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  // Get redirect data from navigation params
  const { redirectTo, bookingData } = route.params || {};

  const handleLoginSuccess = () => {
    if (redirectTo === 'BookingDetailsScreen' && bookingData) {
      // For booking flow, pass both booking data and user info
      navigation.replace(redirectTo, {
        ...bookingData,
        user: {
          email: auth.currentUser.email,
          // Add other user data you might have
        }
      });
    } else {
      // Default navigation after login
      navigation.replace('Main');
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleLoginSuccess();
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "Invalid email address format";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled";
          break;
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Try again later";
          break;
      }
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={28} color="#003580" />
        </TouchableOpacity>

        {/* Logo */}
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue your booking</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color="#003580" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={20} 
            color="#003580" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity 
            onPress={toggleSecureEntry}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#003580" 
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword')} 
          style={styles.forgotPassword}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleEmailLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]}
            disabled={loading}
          >
            <FontAwesome name="google" size={18} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialButton, styles.facebookButton]}
            disabled={loading}
          >
            <FontAwesome name="facebook" size={18} color="#4267B2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp', route.params)}
            disabled={loading}
          >
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 25,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#003580',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#003580',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  googleButton: {
    borderColor: '#DB4437',
    backgroundColor: 'rgba(219, 68, 55, 0.1)',
  },
  facebookButton: {
    borderColor: '#4267B2',
    backgroundColor: 'rgba(66, 103, 178, 0.1)',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#003580',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;