
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoading = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isUserLoggedIn = await AsyncStorage.getItem('keepLoggedIn');
      const isAdminLoggedIn = await AsyncStorage.getItem('keepAdminLoggedIn');

      if (isUserLoggedIn === 'true') {
        navigation.reset({ index: 0, routes: [{ name: 'MainTab' }] });
      } else if (isAdminLoggedIn === 'true') {
        navigation.reset({ index: 0, routes: [{ name: 'AdminPage' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }); // or welcome screen
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#800080" />
    </View>
  );
};

export default AuthLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
