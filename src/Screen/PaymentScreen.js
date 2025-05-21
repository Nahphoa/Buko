import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bus, passengers, selectedSeats, totalFare, bookingId } = route.params || {};
  const [loading, setLoading] = useState(false);

  console.log("PaymentScreen params:", route.params); // Debugging

  const handlePaymentConfirmation = async () => {
    if (!bus || !passengers || !selectedSeats || !bookingId) {
      Alert.alert('Error', 'Missing booking details');
      return;
    }

    setLoading(true);
    try {
      // Update the booking status in Firestore
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'paid',
        paymentDate: new Date().toISOString()
      });

      Alert.alert(
        'Payment Successful',
        'Your booking has been confirmed!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BookingHistory')
          }
        ]
      );
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Failed', 'Could not process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bus || !passengers || !selectedSeats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No booking details available.</Text>
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
      <Text style={styles.header}>Complete Payment</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Text>Bus: {bus.busName} ({bus.busNumber})</Text>
        <Text>Route: {bus.from} → {bus.to}</Text>
        <Text>Date: {bus.date} at {bus.departureTime}</Text>
        <Text>Seats: {selectedSeats.join(', ')}</Text>
        <Text style={styles.total}>Total Amount: ₹{totalFare}</Text>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.subHeader}>Select Payment Method</Text>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>Credit/Debit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>UPI Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentOption}>
          <Text>Net Banking</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.payButton, loading && styles.disabledButton]}
        onPress={handlePaymentConfirmation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Confirm Payment</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  paymentMethods: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#003580',
  },
  paymentOption: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#003580',
    padding: 12,
    borderRadius: 6,
    width: '60%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PaymentScreen;