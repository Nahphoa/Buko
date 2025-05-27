import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const avatars = [
  require('../assets/avatars/avatar1.png'),
  require('../assets/avatars/avatar2.png'),
  require('../assets/avatars/avatar3.png'),
];

export default function ProfileMenu({ navigation }) {
  const [imageBase64, setImageBase64] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const user = auth.currentUser;
  const db = getFirestore();

  const randomDefaultAvatar = useMemo(() => {
    return avatars[Math.floor(Math.random() * avatars.length)];
  }, []);

  useEffect(() => {
    if (user) {
      // Try to get displayName from auth
      if (user.displayName) {
        setUserName(user.displayName);
      } else {
        // Fallback: get name from Firestore user doc if exists
        fetchUserNameFromFirestore();
      }
      fetchProfileImage();
    }
  }, []);

  const fetchUserNameFromFirestore = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.name) {
          setUserName(data.name);
        }
      }
    } catch (err) {
      console.error('Error fetching user name:', err.message);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profileImage) {
          setImageBase64(data.profileImage);
        }
      }
    } catch (err) {
      console.error('Image fetch error:', err.message);
    }
  };

  const chooseFromGallery = async () => {
    setModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64string = result.assets[0].base64;
      await saveProfileImage(base64string);
    }
  };

  const selectAvatar = async (avatar) => {
    setModalVisible(false);
    try {
      const assetUri = Image.resolveAssetSource(avatar).uri;
      const response = await fetch(assetUri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64string = reader.result.split(',')[1];
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
      await setDoc(doc(db, 'users', user.uid), { profileImage: base64string }, { merge: true });
      setImageBase64(base64string);
    } catch (err) {
      Alert.alert('Upload error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, alignItems: 'center' }}>
      <Text style={styles.heading}>Welcome to Buko</Text>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileContainer}>
        {imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={styles.image}
          />
        ) : (
          <Image
            source={randomDefaultAvatar}
            style={styles.image}
          />
        )}
        <Text style={styles.userName}>{userName || 'User'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.button}>
        <Text style={{ color: '	#000080' }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}>
        <Text style={{ color: '	#000080' }}>SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AdminMenu')} style={styles.button}>
        <Text style={{ color: '		#0000FF' }}>Admin Panel</Text>
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
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50, 
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#003580',
  },
  userName: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: '600',
    color: '#003580',
  },
  changeText: {
    marginTop: 8,
    color: '#003580',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  button: {
  borderWidth: 2,
  borderRadius: 10,
  paddingVertical: 10,
  width: 200,
  marginTop: 20,
  borderColor: '#000000',
  alignItems: 'center',
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
});
