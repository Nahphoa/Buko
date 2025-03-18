import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SectionList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Dummy booking data (replace with data from your backend/Firebase)
const dummyBookings = [
  {
    id: '1',
    busName: 'Express Bus 101',
    from: 'New York',
    to: 'Boston',
    date: '2023-10-25',
    time: '08:00 AM',
    seats: ['A1', 'A2'],
    status: 'Confirmed',
    type: 'current', // current or history
  },
  {
    id: '2',
    busName: 'Luxury Bus 202',
    from: 'Los Angeles',
    to: 'San Francisco',
    date: '2023-11-01',
    time: '10:00 AM',
    seats: ['B3'],
    status: 'Canceled',
    type: 'history',
  },
  {
    id: '3',
    busName: 'Sleeper Bus 303',
    from: 'Chicago',
    to: 'Miami',
    date: '2023-09-15',
    time: '09:00 PM',
    seats: ['C4', 'C5'],
    status: 'Completed',
    type: 'history',
  },
];

const BookingScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState(dummyBookings);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bookings from backend/Firebase
  const fetchBookings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(dummyBookings);
      setLoading(false);
    }, 1000);
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
    setRefreshing(false);
  };

  // Handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const updatedBookings = bookings.map((booking) =>
              booking.id === bookingId ? { ...booking, status: 'Canceled', type: 'history' } : booking
            );
            setBookings(updatedBookings);
            Alert.alert('Success', 'Your booking has been canceled.');
          },
        },
      ]
    );
  };

  // Group bookings into current and history
  const groupedBookings = [
    {
      title: 'Current Bookings',
      data: bookings.filter((booking) => booking.type === 'current'),
    },
    {
      title: 'Booking History',
      data: bookings.filter((booking) => booking.type === 'history'),
    },
  ];

  // Render each booking item
  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={() => navigation.navigate('BookingDetails', { booking: item })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.busName}>{item.busName}</Text>
        <Text style={[styles.bookingStatus, { color: item.status === 'Canceled' ? '#ff4444' : '#4CAF50' }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.routeText}>
        {item.from} → {item.to}
      </Text>
      <Text style={styles.dateText}>
        {item.date} | {item.time}
      </Text>
      <Text style={styles.seatsText}>Seats: {item.seats.join(', ')}</Text>
      {item.type === 'current' && item.status === 'Confirmed' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelBooking(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  // Render section header
  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="sad-outline" size={50} color="#003580" />
      <Text style={styles.emptyStateText}>You have no bookings yet.</Text>
    </View>
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#003580" />
      ) : (
        <SectionList
          sections={groupedBookings}
          renderItem={renderBookingItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  bookingItem: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003580',
  },
  bookingStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  seatsText: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 8,
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#003580',
    marginTop: 16,
  },
});

export default BookingScreen;