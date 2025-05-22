import React, { useState, useEffect } from 'react';
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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const BookingDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { busData, selectedSeats } = route.params || {};
  
  const [user, setUser] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize passengers data when component mounts or params change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (busData && selectedSeats) {
        setPassengers(
          selectedSeats.map(seat => ({
            name: currentUser?.displayName || '',
            email: currentUser?.email || '',
            phone: '',
            age: '',
            gender: 'male',
            seat,
          }))
        );
      }
    });

    return unsubscribe;
  }, [busData, selectedSeats]);

  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);

    // Clear error if field is corrected
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
      if (!passenger.name?.trim()) {
        newErrors[`${index}_name`] = 'Name is required';
        isValid = false;
      }
      
      if (!passenger.phone?.trim() || !/^\d{10,15}$/.test(passenger.phone)) {
        newErrors[`${index}_phone`] = 'Valid phone required (10-15 digits)';
        isValid = false;
      }
      
      if (!passenger.age || isNaN(passenger.age) || passenger.age < 1 || passenger.age > 120) {
        newErrors[`${index}_age`] = 'Valid age required (1-120)';
        isValid = false;
      }
      
      if (!passenger.email?.includes('@')) {
        newErrors[`${index}_email`] = 'Valid email required';
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

    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to continue');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);

    try {
      const bookingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalFare = busData.fare * selectedSeats.length;

      const bookingDoc = {
        id: bookingId,
        userId: user.uid,
        busId: busData.busNumber,
        busName: busData.busName,
        from: busData.from,
        to: busData.to,
        date: busData.date,
        departureTime: busData.departureTime,
        farePerSeat: busData.fare,
        totalFare,
        selectedSeats,
        passengers,
        status: 'pending_payment',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'bookings', bookingId), bookingDoc);

      navigation.navigate('PaymentScreen', {
        bookingId,
        bus: {
          ...busData,
          id: busData.busNumber,
          price: busData.fare
        },
        passengers,
        selectedSeats,
        totalFare,
        user: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: passengers[0]?.phone || ''
        }
      });
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert(
        'Booking Failed', 
        error.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!busData || !selectedSeats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No booking details available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Passenger Details</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <Text style={styles.summaryText}>Bus: {busData.busName} ({busData.busNumber})</Text>
        <Text style={styles.summaryText}>Route: {busData.from} → {busData.to}</Text>
        <Text style={styles.summaryText}>Date: {busData.date} at {busData.departureTime}</Text>
        <Text style={styles.summaryText}>Seats: {selectedSeats.join(', ')}</Text>
        <Text style={styles.totalAmount}>Total: ₹{busData.fare * selectedSeats.length}</Text>
      </View>

      {passengers.map((passenger, index) => (
        <View key={`passenger-${index}`} style={styles.passengerCard}>
          <Text style={styles.passengerTitle}>Passenger {index + 1} (Seat: {passenger.seat})</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_name`] && styles.errorInput]}
              value={passenger.name}
              onChangeText={(text) => handleInputChange(index, 'name', text)}
              placeholder="Full name"
            />
            {errors[`${index}_name`] && <Text style={styles.errorText}>{errors[`${index}_name`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_email`] && styles.errorInput]}
              value={passenger.email}
              onChangeText={(text) => handleInputChange(index, 'email', text)}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors[`${index}_email`] && <Text style={styles.errorText}>{errors[`${index}_email`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone*</Text>
            <TextInput
              style={[styles.input, errors[`${index}_phone`] && styles.errorInput]}
              value={passenger.phone}
              onChangeText={(text) => handleInputChange(index, 'phone', text)}
              placeholder="Phone number"
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
              placeholder="Age"
              keyboardType="numeric"
            />
            {errors[`${index}_age`] && <Text style={styles.errorText}>{errors[`${index}_age`]}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    passenger.gender === gender && styles.genderOptionSelected
                  ]}
                  onPress={() => handleInputChange(index, 'gender', gender)}
                >
                  <Text style={[
                    styles.genderOptionText,
                    passenger.gender === gender && styles.genderOptionTextSelected
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
        style={[styles.confirmButton, loading && styles.buttonDisabled]}
        onPress={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003580',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003580',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4CAF50',
  },
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    borderRadius: 8,
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
  genderOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderOptionSelected: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  genderOptionText: {
    color: '#333',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#003580',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#003580',
    borderRadius: 8,
    padding: 12,
    width: '60%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetailsScreen;