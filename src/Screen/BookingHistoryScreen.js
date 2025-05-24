import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  TouchableOpacity,
  RefreshControl 
} from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const BookingHistory = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const bookingsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({ 
          id: doc.id,
          ...data,
          formattedDate: format(new Date(data.busDetails.date), 'PPP'),
          formattedTime: format(new Date(`${data.busDetails.date}T${data.busDetails.departureTime}`), 'p')
        });
      });
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookings();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#003580" />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  const renderBookingStatus = (status) => {
    switch(status) {
      case 'confirmed':
        return (
          <View style={[styles.statusBadge, styles.confirmedBadge]}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, styles.cancelledBadge]}>
            <Text style={styles.statusText}>Cancelled</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        );
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#003580']}
        />
      }
    >
      <Text style={styles.header}>Your Bookings</Text>
      
      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="event-busy" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No bookings found</Text>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.bookNowText}>Book a Trip Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        bookings.map(booking => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingCard}
            onPress={() => navigation.navigate('BookingDetails', { bookingId: booking.id })}
          >
            <View style={styles.bookingHeader}>
              <Text style={styles.routeText}>{booking.busDetails.from} → {booking.busDetails.to}</Text>
              {renderBookingStatus(booking.status)}
            </View>
            
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="date-range" size={18} color="#666" />
                <Text style={styles.detailText}>{booking.formattedDate}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <MaterialIcons name="access-time" size={18} color="#666" />
                <Text style={styles.detailText}>{booking.formattedTime}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <MaterialIcons name="directions-bus" size={18} color="#666" />
                <Text style={styles.detailText}>{booking.busDetails.busName} ({booking.busDetails.busNumber})</Text>
              </View>
            </View>
            
            <View style={styles.passengersSection}>
              <View style={styles.detailRow}>
                <MaterialIcons name="people" size={18} color="#666" />
                <Text style={styles.detailText}>
                  {booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}
                </Text>
              </View>
              <Text style={styles.seatsText}>
                Seats: {booking.seats.join(', ')}
              </Text>
            </View>
            
            <View style={styles.paymentSection}>
              <Text style={styles.amountText}>₹{booking.amount?.toLocaleString('en-IN') || '0'}</Text>
              <Text style={styles.bookingId}>Booking ID: {booking.id.substring(0, 8)}...</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
    paddingBottom: 30
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#003580'
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003580'
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10
  },
  routeText: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#003580',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10
  },
  confirmedBadge: {
    backgroundColor: '#e8f5e9'
  },
  pendingBadge: {
    backgroundColor: '#fff8e1'
  },
  cancelledBadge: {
    backgroundColor: '#ffebee'
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  bookingDetails: {
    marginBottom: 10
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  detailText: {
    fontSize: width * 0.04,
    color: '#666',
    marginLeft: 8
  },
  passengersSection: {
    marginTop: 5,
    marginBottom: 10
  },
  seatsText: {
    fontSize: width * 0.04,
    color: '#666',
    marginLeft: 26
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  amountText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  bookingId: {
    fontSize: width * 0.035,
    color: '#999'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: width * 0.05,
    color: '#666',
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center'
  },
  bookNowButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center'
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default BookingHistory;