import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({ route, navigation }) => {
  const {
    selectedSeats = [],
    totalPrice = 0,
    passengerDetails = {},
    busDetails = {},
  } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState('debitCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!busDetails?.busId || !passengerDetails?.name) {
      Alert.alert(
        'Missing Information',
        'Required booking information is missing. Please start your booking again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, []);

  const handlePaymentConfirmation = async () => {
    let isValid = true;
    let errorMessage = '';

    if (paymentMethod === 'debitCard') {
      if (!cardNumber || cardNumber.length !== 16) {
        isValid = false;
        errorMessage = 'Enter a valid 16-digit card number';
      } else if (
        !expiryDate ||
        !expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
      ) {
        isValid = false;
        errorMessage = 'Enter a valid expiry date (MM/YY)';
      } else if (!cvv || cvv.length !== 3) {
        isValid = false;
        errorMessage = 'Enter a valid 3-digit CVV';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)) {
        isValid = false;
        errorMessage = 'Enter a valid UPI ID (e.g., name@upi)';
      }
    } else {
      isValid = false;
      errorMessage = 'Select a valid payment method';
    }

    if (!isValid) {
      Alert.alert('Invalid Details', errorMessage);
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);

      const newBooking = {
        busName: busDetails.busName,
        from: busDetails.from,
        to: busDetails.to,
        date: busDetails.date,
        time: busDetails.time || 'N/A',
        busId: busDetails.busId,
        selectedSeats,
        totalPrice,
        passengerDetails,
      };

      try {
        const existing = await AsyncStorage.getItem('bookingHistory');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.push(newBooking);
        await AsyncStorage.setItem('bookingHistory', JSON.stringify(parsed));
      } catch (error) {
        console.error('Failed to save booking:', error);
      }

      Alert.alert(
        'Booking Confirmed',
        `Your booking from ${busDetails.from} to ${busDetails.to} on ${busDetails.date} is confirmed!\nSeats: ${selectedSeats.join(', ')}\nAmount: ₹${totalPrice}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Booking') }]
      );
    }, 1500);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#003580" />
        <Text style={styles.loadingText}>Processing Payment...</Text>
      </View>
    );
  }

  if (!busDetails?.busId || !passengerDetails?.name) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Booking information is incomplete</Text>
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
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bus:</Text>
          <Text style={styles.detailValue}>{busDetails.busName || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Route:</Text>
          <Text style={styles.detailValue}>
            {busDetails.from} → {busDetails.to}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{busDetails.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Passenger:</Text>
          <Text style={styles.detailValue}>
            {passengerDetails.name}, {passengerDetails.age},{' '}
            {passengerDetails.gender}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Seats:</Text>
          <Text style={styles.detailValue}>{selectedSeats.join(', ')}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={[styles.detailValue, styles.totalPrice]}>
            ₹{totalPrice}
          </Text>
        </View>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentMethod === 'debitCard' && styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod('debitCard')}
          >
            <Text
              style={[
                styles.paymentText,
                paymentMethod === 'debitCard' && styles.selectedPaymentText,
              ]}
            >
              Debit Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentMethod === 'upi' && styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod('upi')}
          >
            <Text
              style={[
                styles.paymentText,
                paymentMethod === 'upi' && styles.selectedPaymentText,
              ]}
            >
              UPI
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === 'debitCard' && (
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Card Number"
              style={styles.input}
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={16}
            />
            <TextInput
              placeholder="Expiry Date (MM/YY)"
              style={styles.input}
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              placeholder="CVV"
              style={styles.input}
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              secureTextEntry
              maxLength={3}
            />
          </View>
        )}

        {paymentMethod === 'upi' && (
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Enter your UPI ID"
              style={styles.input}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handlePaymentConfirmation}
      >
        <Text style={styles.confirmButtonText}>Pay ₹{totalPrice}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  loadingText: { marginTop: 20, fontSize: 16, color: '#003580' },
  errorContainer: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 20 },
  backButton: {
    backgroundColor: '#003580',
    padding: 12,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  backButtonText: { color: 'white', fontWeight: 'bold' },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: { fontWeight: '600' },
  detailValue: { fontWeight: '400', color: '#333' },
  totalPrice: { color: '#d32f2f', fontWeight: 'bold' },
  paymentContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  paymentMethods: { flexDirection: 'row', marginBottom: 10 },
  paymentButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPayment: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  paymentText: { color: '#333' },
  selectedPaymentText: { color: 'white', fontWeight: 'bold' },
  inputGroup: { marginTop: 10 },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
