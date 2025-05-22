// src/screens/PassengerDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

const PassengerDetailsScreen = ({ navigation, route }) => {
  const { bus, selectedSeats, user } = route.params;
  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      seat,
      name: user?.name || '',
      phone: user?.phone || '',
      age: '',
      gender: 'male'
    }))
  );

  const handleInputChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateAndProceed = () => {
    const isValid = passengers.every(p => 
      p.name.trim() && 
      /^\d{10}$/.test(p.phone) && 
      p.age > 0 && 
      p.age < 120
    );
    
    if (isValid) {
      navigation.navigate('PaymentScreen', {
        bus,
        selectedSeats,
        passengers,
        totalFare: bus.price * selectedSeats.length,
        user
      });
    } else {
      Alert.alert('Invalid Details', 'Please fill all passenger details correctly');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Passenger Details</Text>
      
      {passengers.map((p, index) => (
        <View key={index} style={styles.passengerCard}>
          <Text style={styles.seatText}>Seat: {p.seat}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={p.name}
            onChangeText={t => handleInputChange(index, 'name', t)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={p.phone}
            onChangeText={t => handleInputChange(index, 'phone', t)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={p.age}
            onChangeText={t => handleInputChange(index, 'age', t)}
          />
          
          <View style={styles.genderContainer}>
            {['male', 'female', 'other'].map(gender => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderBtn,
                  p.gender === gender && styles.selectedGender
                ]}
                onPress={() => handleInputChange(index, 'gender', gender)}
              >
                <Text>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.proceedBtn}
        onPress={validateAndProceed}
      >
        <Text style={styles.proceedText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  passengerCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15 
  },
  seatText: { fontWeight: 'bold', marginBottom: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 10 
  },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  genderBtn: { 
    padding: 10, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5 
  },
  selectedGender: { backgroundColor: '#003580', borderColor: '#003580' },
  proceedBtn: { 
    backgroundColor: '#4CAF50', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  proceedText: { color: '#fff', fontWeight: 'bold' }
});

export default PassengerDetailsScreen;