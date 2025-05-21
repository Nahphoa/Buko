// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import StackNavigator from './src/navigation/StackNavigator'; // ✅ FIXED path
import { AuthProvider } from './src/context/AuthContext'; // ✅ Matches your structure

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <StackNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});