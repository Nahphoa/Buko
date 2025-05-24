import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bus, passengers, selectedSeats, totalFare, bookingId, userId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Paytm Wallet', icon: '💰' }
  ];

  const simulatePaymentSuccess = async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Missing booking ID. Please start the booking process again.');
      return;
    }

    setLoading(true);
    try {
      const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create payment record
      await addDoc(collection(db, 'payments'), {
        bookingId: bookingId,
        paymentId: paymentId,
        amount: totalFare || 0,
        currency: 'INR',
        method: selectedMethod || 'card',
        status: 'completed',
        userId: userId || 'unknown',
        timestamp: serverTimestamp()
      });

      // Update booking status
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'confirmed',
        paymentId: paymentId,
        paymentMethod: selectedMethod || 'card',
        paidAt: serverTimestamp(),
        passengers: passengers?.map(p => ({
          name: p.name || 'Unknown',
          age: p.age || 0,
          gender: p.gender || 'Unknown',
          phone: p.phone || 'Not provided',
          email: p.email || 'Not provided'
        })) || [],
        seats: selectedSeats || [],
        busDetails: {
          name: bus?.busName || 'Unknown',
          number: bus?.busNumber || 'Unknown',
          from: bus?.from || 'Unknown',
          to: bus?.to || 'Unknown',
          date: bus?.date || new Date().toISOString(),
          departureTime: bus?.departureTime || 'Unknown'
        }
      });

      navigation.navigate('BookingConfirmation', {
        bookingId,
        paymentId,
        bus,
        passengers,
        selectedSeats,
        totalFare,
        paymentMethod: selectedMethod
      });
      
    } catch (error) {
      console.error('Firestore error:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay ₹${totalFare?.toLocaleString('en-IN') || '0'} via ${paymentMethods.find(m => m.id === selectedMethod)?.name || 'selected method'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: simulatePaymentSuccess }
      ]
    );
  };

  if (!bus || !passengers || !selectedSeats) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={50} color="#f44336" />
        <Text style={styles.errorText}>Invalid booking details</Text>
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
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>Complete Payment</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Text style={styles.summaryText}>Bus: {bus.busName} ({bus.busNumber})</Text>
        <Text style={styles.summaryText}>Route: {bus.from} → {bus.to}</Text>
        <Text style={styles.summaryText}>Date: {bus.date} at {bus.departureTime}</Text>
        <Text style={styles.summaryText}>Seats: {selectedSeats.join(', ')}</Text>
        <Text style={styles.summaryText}>Passengers: {passengers.length}</Text>
        <View style={styles.passengerDetails}>
          {passengers.map((passenger, index) => (
            <Text key={index} style={styles.passengerText}>
              {passenger.name} (Seat: {selectedSeats[index]})
            </Text>
          ))}
        </View>
        <Text style={styles.total}>Total: ₹{totalFare.toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.subHeader}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedMethod === method.id && styles.selectedPaymentOption
            ]}
            onPress={() => setSelectedMethod(method.id)}
            disabled={loading}
          >
            <Text style={styles.paymentMethodText}>
              {method.icon}  {method.name}
            </Text>
            {selectedMethod === method.id && (
              <Text style={styles.selectedIcon}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.payButton, (loading || !selectedMethod) && styles.disabledButton]}
        onPress={handlePaymentConfirmation}
        disabled={loading || !selectedMethod}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Pay ₹{totalFare.toLocaleString('en-IN')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.06,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#003580',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#003580',
  },
  summaryText: {
    fontSize: width * 0.045,
    marginBottom: 8,
    color: '#333',
  },
  passengerDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  passengerText: {
    fontSize: width * 0.04,
    marginBottom: 5,
    color: '#555'
  },
  total: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#4CAF50',
  },
  paymentMethods: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 9,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subHeader: {
    fontSize: width * 0.055,
    fontWeight: '600',
    marginBottom: 8,
    color: '#003580',
  },
  paymentOption: {
    padding: 11,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 30,
  },
  selectedPaymentOption: {
    borderColor: '#003580',
    backgroundColor: '#e6f0fa',
  },
  paymentMethodText: {
    fontSize: width * 0.045,
  },
  selectedIcon: {
    color: '#003580',
    fontWeight: 'bold',
    fontSize: 20,
  },
  payButton: {
    backgroundColor: '#003580',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    minHeight: 30,
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
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
    fontSize: width * 0.05,
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    minHeight: 60,
  },
  backButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;