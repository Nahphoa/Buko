import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { 
    selectedSeats, 
    totalPrice, 
    passengerDetails,
    busDetails 
  } = route.params;

  const [paymentMethod, setPaymentMethod] = useState('debitCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const handlePaymentConfirmation = () => {
    // Validate payment details
    let isValid = true;
    let errorMessage = '';

    switch (paymentMethod) {
      case 'debitCard':
        if (!cardNumber || !expiryDate || !cvv) {
          isValid = false;
          errorMessage = 'Please fill in all card details';
        }
        break;
      case 'upi':
        if (!upiId) {
          isValid = false;
          errorMessage = 'Please enter your UPI ID';
        }
        break;
      default:
        isValid = false;
        errorMessage = 'Please select a payment method';
    }

    if (!isValid) {
      Alert.alert('Error', errorMessage);
      return;
    }

    // Payment successful - show confirmation
    Alert.alert(
      'Booking Confirmed',
      `Your booking for ${busDetails.from} to ${busDetails.to} on ${busDetails.date} has been confirmed!`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Booking Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bus ID:</Text>
          <Text style={styles.detailValue}>{busDetails.busId}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Route:</Text>
          <Text style={styles.detailValue}>{busDetails.from} → {busDetails.to}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>{busDetails.date}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Passenger:</Text>
          <Text style={styles.detailValue}>{passengerDetails.name} ({passengerDetails.age}, {passengerDetails.gender})</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Seats:</Text>
          <Text style={styles.detailValue}>{selectedSeats.join(', ')}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={[styles.detailValue, styles.totalPrice]}>₹{totalPrice}</Text>
        </View>
      </View>

      {/* Payment Method Selection */}
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'debitCard' && styles.selectedMethod
          ]}
          onPress={() => setPaymentMethod('debitCard')}
        >
          <Text>Debit Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.methodButton,
            paymentMethod === 'upi' && styles.selectedMethod
          ]}
          onPress={() => setPaymentMethod('upi')}
        >
          <Text>UPI</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Details Form */}
      {paymentMethod === 'debitCard' && (
        <View style={styles.paymentForm}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
          />
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>
      )}

      {paymentMethod === 'upi' && (
        <View style={styles.paymentForm}>
          <TextInput
            style={styles.input}
            placeholder="UPI ID (e.g., name@upi)"
            value={upiId}
            onChangeText={setUpiId}
          />
        </View>
      )}

      {/* Confirm Payment Button */}
      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={handlePaymentConfirmation}
      >
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#003580',
    fontSize: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedMethod: {
    borderColor: '#003580',
    backgroundColor: '#e6f0ff',
  },
  paymentForm: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  confirmButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;