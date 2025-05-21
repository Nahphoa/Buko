import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BookingDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { busData, selectedSeats, user } = route.params;

  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      name: user?.name || '',
      phone: user?.phone || '',
      age: '',
      gender: 'male',
      seat,
    }))
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const totalFare = busData.fare * selectedSeats.length;

  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);

    if (errors[`${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}_${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`${index}_name`] = 'Name is required';
        isValid = false;
      }
      if (!passenger.phone.trim() || !/^\d{10,15}$/.test(passenger.phone)) {
        newErrors[`${index}_phone`] = 'Valid phone required (10-15 digits)';
        isValid = false;
      }
      if (!passenger.age || isNaN(passenger.age) || passenger.age < 1 || passenger.age > 120) {
        newErrors[`${index}_age`] = 'Valid age required (1-120)';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct all passenger details');
      return;
    }

    setLoading(true);

    try {
      const bookingDoc = {
        userId: user?.uid || 'anonymous',
        busId: busData.busNumber || 'N/A',
        busName: busData.busName || '',
        from: busData.from,
        to: busData.to,
        date: busData.date,
        time: busData.departureTime,
        farePerSeat: busData.fare,
        totalFare: totalFare,
        selectedSeats: selectedSeats,
        passengers: passengers,
        status: 'pending',
        timestamp: Timestamp.now(),
      };

      // Save to Firestore and get the document reference
      const docRef = await addDoc(collection(db, 'bookings'), bookingDoc);

      setLoading(false);
      
      // Navigate to PaymentScreen with all required parameters
      navigation.navigate('PaymentScreen', {
        bus: {
          ...busData,
          id: busData.busNumber,
          price: busData.fare
        },
        passengers: passengers,
        selectedSeats: selectedSeats,
        totalFare: totalFare,
        bookingId: docRef.id,  // Include the Firestore document ID
        user: user
      });
    } catch (error) {
      setLoading(false);
      console.error('Firestore Error:', error);
      Alert.alert('Booking Failed', 'Something went wrong while saving your booking.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fill your Details</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <Text>Bus: {busData.busName}</Text>
        <Text>Route: {busData.from} → {busData.to}</Text>
        <Text>Date: {busData.date}</Text>
        <Text>Time: {busData.departureTime}</Text>
        <Text>Seats: {selectedSeats.join(', ')}</Text>
        <Text style={styles.total}>Total: ₹{totalFare}</Text>
      </View>

      {passengers.map((passenger, index) => (
        <View key={index} style={styles.passengerCard}>
          <Text style={styles.passengerTitle}>Passenger {index + 1} (Seat: {passenger.seat})</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_name`] && styles.errorInput]}
              value={passenger.name}
              onChangeText={(text) => handleInputChange(index, 'name', text)}
              placeholder="Enter full name"
            />
            {errors[`${index}_name`] && <Text style={styles.errorText}>{errors[`${index}_name`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_phone`] && styles.errorInput]}
              value={passenger.phone}
              onChangeText={(text) => handleInputChange(index, 'phone', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            {errors[`${index}_phone`] && <Text style={styles.errorText}>{errors[`${index}_phone`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_age`] && styles.errorInput]}
              value={passenger.age}
              onChangeText={(text) => handleInputChange(index, 'age', text)}
              placeholder="Enter age"
              keyboardType="numeric"
            />
            {errors[`${index}_age`] && <Text style={styles.errorText}>{errors[`${index}_age`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    passenger.gender === gender && styles.genderSelected
                  ]}
                  onPress={() => handleInputChange(index, 'gender', gender)}
                >
                  <Text style={[
                    styles.genderText,
                    passenger.gender === gender && styles.genderTextSelected
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.confirmButton, loading && styles.disabledButton]}
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Proceed to Payment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#003580',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003580',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4CAF50',
  },
  passengerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderSelected: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  genderText: {
    color: '#333',
  },
  genderTextSelected: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default BookingDetailsScreen;