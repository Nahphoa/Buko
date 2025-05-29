import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AdminMenu({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Access</Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AdminLog')}
        style={[styles.button, { borderColor: 'orange' }]}
      >
        <Text style={[styles.buttonText, { color: 'blue' }]}>Admin Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AdminSign')}
        style={[styles.button, { borderColor: 'green' }]}
      >
        <Text style={[styles.buttonText, { color: 'green' }]}>Admin SignUp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
