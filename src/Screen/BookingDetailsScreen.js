import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const BookingDetailsScreen = ({ navigation, route }) => {
  const { busData = {}, selectedSeats = [], user } = route.params || {};
  const totalFare = (busData.fare || 0) * selectedSeats.length;

  const [passengers, setPassengers] = useState([]);
  const [currentPassenger, setCurrentPassenger] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: '',
    gender: 'male',
    seat: selectedSeats[0] || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Booking Details',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#003580" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user && selectedSeats.length > 0 && passengers.length === 0) {
      setCurrentPassenger((prev) => ({
        ...prev,
        seat: selectedSeats[0],
      }));
    }
  }, [user, selectedSeats]);

  useEffect(() => {
    if (selectedSeats.length > passengers.length) {
      setCurrentPassenger((prev) => ({
        ...prev,
        seat: selectedSeats[passengers.length] || '',
      }));
    }
  }, [passengers, selectedSeats]);

  const handleInputChange = (field, value) => {
    setCurrentPassenger((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validatePassenger = () => {
    const newErrors = {};
    if (!currentPassenger.name.trim()) newErrors.name = 'Name is required';
    if (!currentPassenger.phone.trim() || !/^\d{10,15}$/.test(currentPassenger.phone)) {
      newErrors.phone = 'Enter a valid phone number (10-15 digits)';
    }
    if (
      !currentPassenger.age ||
      isNaN(currentPassenger.age) ||
      currentPassenger.age < 1 ||
      currentPassenger.age > 120
    ) {
      newErrors.age = 'Enter a valid age (1-120)';
    }
    if (!currentPassenger.seat) newErrors.seat = 'No seat assigned';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPassenger = () => {
    if (validatePassenger()) {
      setPassengers((prev) => [...prev, currentPassenger]);
      setCurrentPassenger({
        name: '',
        phone: '',
        age: '',
        gender: 'male',
        seat: selectedSeats[passengers.length + 1] || '',
      });
    }
  };

  const confirmAndPay = () => {
    if (passengers.length === 0) {
      Alert.alert('Error', 'Please add at least one passenger');
      return;
    }

    if (passengers.length !== selectedSeats.length) {
      Alert.alert('Error', 'Please assign all selected seats to passengers');
      return;
    }

    const bookingDetails = {
      bus: busData,
      passengers,
      selectedSeats,
      totalFare,
      user,
    };

    navigation.navigate('PaymentScreen', { bookingDetails });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Booking Details</Text>

      {passengers.map((passenger, index) => (
        <View key={index} style={styles.passengerCard}>
          <View style={styles.passengerHeader}>
            <Text style={styles.cardTitle}>Passenger {index + 1}</Text>
          </View>
          <Text>Name: {passenger.name}</Text>
          <Text>Phone: {passenger.phone}</Text>
          <Text>Age: {passenger.age}</Text>
          <Text>Gender: {passenger.gender}</Text>
          <Text>Seat: {passenger.seat}</Text>
        </View>
      ))}

      {passengers.length < selectedSeats.length && (
        <>
          <Text style={styles.sectionTitle}>Add Passenger {passengers.length + 1}</Text>
          {[{ field: 'name', label: 'Full Name*', placeholder: 'John Doe' },
            { field: 'phone', label: 'Phone*', placeholder: '0712345678', keyboardType: 'phone-pad' },
            { field: 'age', label: 'Age*', placeholder: '25', keyboardType: 'numeric' }
          ].map(({ field, label, placeholder, keyboardType }) => (
            <View key={field} style={styles.formGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={[styles.input, errors[field] && styles.errorInput]}
                value={currentPassenger[field]}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder={placeholder}
                keyboardType={keyboardType}
              />
              {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
            </View>
          ))}

          {/* Gender */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    currentPassenger.gender === gender && styles.genderSelected,
                  ]}
                  onPress={() => handleInputChange('gender', gender)}
                >
                  <Text style={currentPassenger.gender === gender && styles.genderTextSelected}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seat Display */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Seat*</Text>
            <TextInput style={styles.input} value={currentPassenger.seat} editable={false} />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addPassenger}>
            <Text style={styles.addButtonText}>+ Add Passenger</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <Text>Bus: {busData.busName || 'BUKO Travel'}</Text>
        <Text>Route: {busData.departureStation || 'N/A'} → {busData.arrivalStation || 'N/A'}</Text>
        <Text>Departure Station: {busData.departureStationName || 'BUKO Dimapur Station'}</Text>
        <Text>Arrival Station: {busData.arrivalStationName || 'BUKO Mon Station'}</Text>
        <Text>Date: {busData.departureDate || 'N/A'}</Text>
        <Text>Time: {busData.departureTime || '4:30 PM'}</Text>
        <Text>Seats: {selectedSeats.join(', ') || 'N/A'}</Text>
        <Text style={styles.total}>Total: KES {totalFare.toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          passengers.length !== selectedSeats.length && styles.disabledButton,
        ]}
        onPress={confirmAndPay}
        disabled={passengers.length !== selectedSeats.length}
      >
        <Text style={styles.confirmText}>
          {passengers.length === selectedSeats.length ? 'Confirm & Pay' : 'Assign All Seats First'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003580',
  },
  passengerCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212529',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    color: '#212529',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#495057',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#dc3545',
    backgroundColor: '#fff8f9',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  genderSelected: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  genderTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#212529',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: '#28a745',
  },
  confirmButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default BookingDetailsScreen;
