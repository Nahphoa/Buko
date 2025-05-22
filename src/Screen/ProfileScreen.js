import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return 'user';
  };

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      if (!email || !password || (isSignup && !confirmPassword)) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (isSignup && password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      if (isSignup && password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (isSignup && isAdminLogin) {
        Alert.alert('Error', 'Admin accounts must be created through the admin panel');
        return;
      }

      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (isAdminLogin) {
          const role = await fetchUserRole(userCredential.user.uid);
          if (role !== 'admin') {
            await auth.signOut();
            Alert.alert('Error', 'Admin privileges required. Please use regular login.');
            return;
          }
        }
      }

      const role = await fetchUserRole(userCredential.user.uid);
      const userData = {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        role,
      };

      setUser(userData);
      setIsLoggedIn(true);
      Alert.alert('Success', isSignup ? 'Account created successfully!' : 'Logged in successfully!');
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === 'auth/invalid-credential') {
        errorMessage = isAdminLogin
          ? 'Invalid admin credentials. Please check your email and password.'
          : 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }

      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUser(null);
    setProfileImage('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
    setIsAdminLogin(false);
  };

  if (isLoggedIn && user) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.title}>Welcome,</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.roleText}>Role: {user.role}</Text>

        {user.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('AdminPanel')}
          >
            <Text style={styles.adminButtonText}>Go to Admin Panel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</Text>

        {!isSignup && (
          <View style={styles.adminToggleContainer}>
            <Text style={styles.adminToggleText}>Admin Login</Text>
            <Switch
              value={isAdminLogin}
              onValueChange={setIsAdminLogin}
              trackColor={{ false: '#767577', true: '#003580' }}
              thumbColor={isAdminLogin ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {isSignup && (
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? 'Sign Up' : isAdminLogin ? 'Login as Admin' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsSignup(!isSignup);
            setIsAdminLogin(false);
          }}
          disabled={isLoading}
        >
          <Text style={styles.switchText}>
            {isSignup
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003580',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#003580',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    marginTop: 16,
    color: '#003580',
    fontSize: 14,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#003580',
  },
  email: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  roleText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  adminToggleText: {
    fontSize: 16,
    color: '#003580',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
