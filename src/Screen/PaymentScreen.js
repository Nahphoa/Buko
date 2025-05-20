import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
// Adjust the path based on your file structure

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingDetails } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { id: 'upi', name: 'UPI Payment', icon: 'phone-portrait', description: 'Pay via Google Pay, PhonePe, etc.' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: 'wallet', name: 'BUKO Wallet', icon: 'wallet' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 🔥 Save booking to Firestore
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error('User not authenticated');

      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        userEmail: user.email,
        busName: bookingDetails?.bus?.busName,
        from: bookingDetails?.bus?.departureStation,
        to: bookingDetails?.bus?.arrivalStation,
        date: bookingDetails?.bus?.departureDate,
        time: bookingDetails?.bus?.departureTime,
        seats: bookingDetails?.selectedSeats,
        passengers: bookingDetails?.passengers,
        totalFare: bookingDetails?.totalFare,
        paymentMethod: selectedMethod,
        bookedAt: Timestamp.now(),
      });

      // ✅ Show success alert and navigate
      Alert.alert(
        'Payment Successful',
        `Paid via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`,
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('BookingConfirmation', { bookingDetails }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', error.message || 'Please try another payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      

      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="wallet-outline" size={60} color="#003580" style={styles.icon} />
        <Text style={styles.title}>Complete Payment</Text>

        <View style={styles.tripDetails}>
          <Text style={styles.busName}>{bookingDetails?.bus?.busName || 'BUKO Travel'}</Text>
          <View style={styles.route}>
            <Text style={styles.station}>{bookingDetails?.bus?.departureStation}</Text>
            <Ionicons name="arrow-forward" size={16} color="#666" />
            <Text style={styles.station}>{bookingDetails?.bus?.arrivalStation}</Text>
          </View>
          <Text style={styles.datetime}>
            {bookingDetails?.bus?.departureDate} • {bookingDetails?.bus?.departureTime}
          </Text>
          <Text style={styles.passengers}>
            {bookingDetails?.selectedSeats?.join(', ')} • {bookingDetails?.passengers?.length} passengers
          </Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.selectedCard]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.methodInfo}>
              <Ionicons
                name={method.icon}
                size={24}
                color={selectedMethod === method.id ? '#003580' : '#666'}
              />
              <View style={styles.methodTexts}>
                <Text style={styles.methodName}>{method.name}</Text>
                {method.description && (
                  <Text style={styles.methodDesc}>{method.description}</Text>
                )}
              </View>
            </View>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={20} color="#003580" />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.amount}>₹{bookingDetails?.totalFare?.toLocaleString() || '0'}</Text>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <TouchableOpacity
        style={[styles.payButton, (!selectedMethod || loading) && styles.disabledButton]}
        onPress={handlePayment}
        disabled={!selectedMethod || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {selectedMethod
              ? `Pay via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`
              : 'Select Payment Method'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003580',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003580',
    textAlign: 'center',
    marginBottom: 20,
  },
  tripDetails: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 1,
  },
  busName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  station: {
    fontSize: 15,
    color: '#333',
  },
  datetime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  passengers: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginTop: 8,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: '#003580',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodTexts: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  methodDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
  payButton: {
    backgroundColor: '#003580',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentScreen;
