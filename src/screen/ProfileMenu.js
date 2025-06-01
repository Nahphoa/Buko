import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatars = [
  require('../Image/avatars/avatar1.png'),
  require('../Image/avatars/avatar2.png'),
  require('../Image/avatars/avatar3.png'),
];

export default function ProfileMenu({ navigation }) {
  const [imageBase64, setImageBase64] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  const db = getFirestore();

  const randomDefaultAvatar = useMemo(() => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  }, []);

  // Load cached profile data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('profileData');
        if (cachedData) {
          const { userName, email, phone, isAdmin, imageBase64 } = JSON.parse(cachedData);
          setUserName(userName || '');
          setEmail(email || user?.email || '');
          setPhone(phone || '');
          setIsAdmin(isAdmin || false);
          setImageBase64(imageBase64 || null);
          setLoading(false);
        } else {
          // No cached data, fetch from Firestore
          fetchDataFromFirestore();
        }
      } catch (err) {
        console.error('Error loading cached profile data:', err);
        setEmail(user?.email || '');
        fetchDataFromFirestore();
      }
    };

    loadCachedData();
  }, []);

  const fetchDataFromFirestore = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const adminDocSnap = await getDoc(doc(db, 'Admins', user.uid));
      if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        setIsAdmin(true);
        setUserName(adminData.username || '');
        setPhone(adminData.phoneNumber || '');
        setEmail(user.email || '');
        setImageBase64(adminData.profileImage || null);
        cacheProfileData({
          userName: adminData.username || '',
          email: user.email || '',
          phone: adminData.phoneNumber || '',
          isAdmin: true,
          imageBase64: adminData.profileImage || null,
        });
      } else {
        const userDocSnap = await getDoc(doc(db, 'users', user.uid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setIsAdmin(false);
          setUserName(userData.username || '');
          setPhone(userData.phoneNumber || '');
          setEmail(user.email || '');
          setImageBase64(userData.profileImage || null);
          cacheProfileData({
            userName: userData.username || '',
            email: user.email || '',
            phone: userData.phoneNumber || '',
            isAdmin: false,
            imageBase64: userData.profileImage || null,
          });
        } else {
          // No user document found, fallback
          setUserName('');
          setPhone('');
          setIsAdmin(false);
          setEmail(user.email || '');
          setImageBase64(null);
          cacheProfileData({
            userName: '',
            email: user.email || '',
            phone: '',
            isAdmin: false,
            imageBase64: null,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const cacheProfileData = async (data) => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving profile data to cache:', err);
    }
  };

  // Pick image from gallery
  const chooseFromGallery = async () => {
    setModalVisible(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64string = result.assets[0].base64;
        if (base64string) {
          await saveProfileImage(base64string);
        } else {
          Alert.alert('Error', 'Could not get image data');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
      console.error(error);
    }
  };

  // Select avatar image
  const selectAvatar = async (avatar) => {
    setModalVisible(false);
    try {
      
      const assetUri = Image.resolveAssetSource(avatar).uri;
      const response = await fetch(assetUri);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64string = reader.result.split(',')[1]; // Remove data:image/...;base64, part
        await saveProfileImage(base64string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      Alert.alert('Error', 'Failed to load avatar image');
      console.error(err);
    }
  };

  const saveProfileImage = async (base64string) => {
    try {
      if (!user) return;
      if (isAdmin) {
        await setDoc(
          doc(db, 'Admins', user.uid),
          { profileImage: base64string },
          { merge: true }
        );
      } else {
        await setDoc(
          doc(db, 'users', user.uid),
          { profileImage: base64string },
          { merge: true }
        );
      }
      setImageBase64(base64string);
      cacheProfileData({
        userName,
        email,
        phone,
        isAdmin,
        imageBase64: base64string,
      });
    } catch (err) {
      Alert.alert('Upload error', err.message);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'Yes, Logout',
          onPress: async () => {
            try {
              await auth.signOut();
              await AsyncStorage.removeItem('keepLoggedIn');
              await AsyncStorage.removeItem('profileData');
              navigation.replace('Login'); 
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#003580" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 50, alignItems: 'center' }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileContainer}>
       <Image
         source={
           imageBase64
             ? { uri: `data:image/jpeg;base64,${imageBase64}` }
             : randomDefaultAvatar
         }
         style={styles.image}
       />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{userName || 'Not set'}</Text>
          <Text style={styles.infoText}>{email || 'Not available'}</Text>
          <Text style={styles.infoText}>{phone || 'Not available'}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.heading}>Welcome to Buko</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AdminMenu')} style={styles.button}>
        <Text style={styles.buttonText}>Admin Panel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.button, { borderColor: '#000000' }]}>
        <Text style={[styles.buttonText, { color: '#000080' }]}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Choose Picture</Text>

            <TouchableOpacity onPress={chooseFromGallery} style={styles.modalButton}>
              <Text>Select from Gallery</Text>
            </TouchableOpacity>

            <FlatList
              data={avatars}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectAvatar(item)}>
                  <Image source={item} style={styles.avatar} />
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
            />

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003580',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  image: {
    width: 60,
    height: 70,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#003580',
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#003580',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#000',
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    width: 200,
    marginTop: 20,
    borderColor: '#000',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000080',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
