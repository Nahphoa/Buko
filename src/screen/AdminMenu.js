import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function AdminMenu({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo at top center */}
      <Image
        source={require('../Image/logo.png')} // Replace with your logo path
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Admin Access</Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AdminLog')}
        style={[styles.button, { borderColor: 'navy' }]}
      >
        <Text style={[styles.buttonText, { color: 'navy' }]}>Admin Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('AdminSign')}
        style={[styles.button, { borderColor: 'navy' }]}
      >
        <Text style={[styles.buttonText, { color: 'Navy' }]}>Admin SignUp</Text>
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
    marginTop:-70,
    backgroundColor: '#fff',
  },
  logo: {
    width: 230,
    height: 200,
    marginBottom: 20,
    marginTop: -40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#003580',
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
