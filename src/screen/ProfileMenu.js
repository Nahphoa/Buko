import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileMenu({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Please</Text>
        <Text style={styles.headingText}>Register to Buko</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={[styles.button, {paddingHorizontal: 50, borderColor: 'blue' }]}
        >
          <Text style={[styles.buttonText, { color: 'blue', }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('SignUp')}
          style={[styles.button, { paddingHorizontal: 50,borderColor: 'green' }]}
        >
          <Text style={[styles.buttonText, { color: 'green' }]}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    paddingTop: 50,
    paddingLeft: 100,
  },
  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 100,
    paddingTop: 150,
    alignItems: 'center',
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
