import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { bookingId, paymentId, bus, passengers, selectedSeats, totalFare } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (bookingId && paymentId) {
      confirmBooking();
    }
  }, [bookingId, paymentId]);

  const confirmBooking = async () => {
    if (!bookingId || !paymentId) {
      Alert.alert('Error', 'Missing booking or payment details');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'confirmed',
        paymentId: paymentId,
        paymentDate: new Date().toISOString(),
        confirmedAt: new Date().toISOString()
      });

      setBookingConfirmed(true);
    } catch (error) {
      console.error('Failed to confirm booking:', error);
      Alert.alert('Error', 'Failed to confirm booking. Please check your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = () => {
    navigation.navigate('BookingHistory');
  };

  const handleNewBooking = () => {
    navigation.navigate('Home');
  };

  if (!bookingId || !paymentId) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={50} color="#f44336" />
        <Text style={styles.errorText}>Booking confirmation failed</Text>
        <Text style={styles.subText}>Missing booking or payment details</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BookingHistory')}
        >
          <Text style={styles.buttonText}>Check My Bookings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#003580" />
          <Text style={styles.loadingText}>Confirming your booking...</Text>
        </View>
      ) : bookingConfirmed ? (
        <View style={styles.confirmationContainer}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.header}>Booking Confirmed!</Text>
          <Text style={styles.subHeader}>Your payment was successful</Text>
          
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Booking Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Booking ID:</Text>
              <Text style={styles.detailValue}>{bookingId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment ID:</Text>
              <Text style={styles.detailValue}>{paymentId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Bus:</Text>
              <Text style={styles.detailValue}>{bus?.busName} ({bus?.busNumber})</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Route:</Text>
              <Text style={styles.detailValue}>{bus?.from} → {bus?.to}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date & Time:</Text>
              <Text style={styles.detailValue}>{bus?.date} at {bus?.departureTime}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seats:</Text>
              <Text style={styles.detailValue}>{selectedSeats?.join(', ')}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Paid:</Text>
              <Text style={[styles.detailValue, styles.totalAmount]}>₹{totalFare}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewBookings}
          >
            <Text style={styles.primaryButtonText}>View My Bookings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleNewBooking}
          >
            <Text style={styles.secondaryButtonText}>Book Another Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centered}>
          <MaterialIcons name="error-outline" size={50} color="#f44336" />
          <Text style={styles.errorText}>Booking confirmation failed</Text>
          <Text style={styles.subText}>Please check your bookings list</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BookingHistory')}
          >
            <Text style={styles.buttonText}>Check My Bookings</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  totalAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#003580',
  },
  secondaryButtonText: {
    color: '#003580',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#003580',
  },
});

export default BookingConfirmationScreen;