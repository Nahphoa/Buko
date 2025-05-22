import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import RazorpayCheckout from 'react-native-razorpay';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bus, passengers, selectedSeats, totalFare, bookingId, userId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);

  // Payment methods data
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
    { id: 'wallet', name: 'Paytm Wallet', icon: '💰' }
  ];

  useEffect(() => {
    const checkRazorpay = async () => {
      try {
        if (Platform.OS === 'android') {
          const { NativeModules } = require('react-native');
          setRazorpayAvailable(!!NativeModules.RazorpayCheckout);
        } else {
          setRazorpayAvailable(!!RazorpayCheckout && typeof RazorpayCheckout.open === 'function');
        }
      } catch (error) {
        console.error('Razorpay check failed:', error);
        Alert.alert('Payment Unavailable', 'Payment service is currently not working. Please try again later.');
      }
    };

    checkRazorpay();
  }, []);

  const initiateRazorpayPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!razorpayAvailable) {
      Alert.alert('Error', 'Payment service is not ready. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      const options = {
        description: `Bus Ticket: ${bus.busName} (${bus.busNumber})`,
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_YOUR_API_KEY', // REPLACE WITH YOUR KEY
        amount: totalFare * 100,
        name: 'Bus Ticket Booking',
        prefill: {
          email: passengers[0]?.email || 'user@example.com',
          contact: passengers[0]?.phone || '9876543210',
          name: passengers[0]?.name || 'Passenger'
        },
        theme: { color: '#003580' },
        method: {
          [selectedMethod]: true
        }
      };

      RazorpayCheckout.open(options)
        .then(async (data) => {
          await handlePaymentSuccess(data.razorpay_payment_id);
        })
        .catch((error) => {
          handlePaymentFailure(error);
        });
    } catch (error) {
      console.error('Payment initiation error:', error);
      Alert.alert('Error', 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      await addDoc(collection(db, 'payments'), {
        bookingId,
        paymentId,
        amount: totalFare,
        currency: 'INR',
        method: selectedMethod,
        status: 'completed',
        userId,
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'paid',
        paymentId,
        paymentMethod: selectedMethod,
        paidAt: serverTimestamp()
      });

      Alert.alert(
        'Payment Successful',
        `Your booking is confirmed! Payment ID: ${paymentId}`,
        [{
          text: 'OK',
          onPress: () => navigation.navigate('BookingConfirmation', {
            bookingId,
            paymentId,
            ...route.params
          })
        }]
      );
    } catch (error) {
      console.error('Database update error:', error);
      Alert.alert(
        'Payment Record Issue',
        'Your payment was successful but we encountered a record-keeping issue. Please note your Payment ID.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (error) => {
    setLoading(false);
    let errorMessage = 'Payment was cancelled';
    
    if (error.error?.description) {
      errorMessage = error.error.description;
    } else if (error.code) {
      errorMessage = `Error: ${error.code}`;
    }

    Alert.alert('Payment Failed', errorMessage);
  };

  const handlePaymentConfirmation = () => {
    Alert.alert(
      'Confirm Payment',
      `Pay ₹${totalFare.toLocaleString('en-IN')} via ${paymentMethods.find(m => m.id === selectedMethod)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: initiateRazorpayPayment }
      ]
    );
  };

  if (!bus || !passengers || !selectedSeats) {
    return (
      <View style={styles.centered}>
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
              {method.icon}  {method.name} {/* Added extra space after icon */}
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
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Text style={styles.payButtonText}>Pay ₹{totalFare.toLocaleString('en-IN')}</Text>
        )}
      </TouchableOpacity>

      {!razorpayAvailable && (
        <Text style={styles.warningText}>
          Payment service initializing... Try again in a moment.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.06, // 6% of screen width
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: width * 0.08, // 8% of screen width
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
  warningText: {
    color: '#FF9800',
    textAlign: 'center',
    marginTop: 12,
    fontSize: width * 0.04,
  },
});

export default PaymentScreen;