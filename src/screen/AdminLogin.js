import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !source || !destination || !adminKey) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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

  const onRefresh = () => {
    setRefreshing(true);
    // Clear all input fields
    setEmail('');
    setPassword('');
    setSource('');
    setDestination('');
    setAdminKey('');
    setShowPassword(false);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image
        source={require('../Image/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Admin Login</Text>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          value={password}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="map-marker-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter source"
          onChangeText={setSource}
          value={source}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="map-marker-radius-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          onChangeText={setDestination}
          value={destination}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="key-outline" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Admin Key"
          onChangeText={setAdminKey}
          value={adminKey}
        />
      </View>

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
    marginTop: -60,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: -30,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: '100%',
  },
  icon: {
    marginRight: 8,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
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
