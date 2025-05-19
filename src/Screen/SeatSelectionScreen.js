import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SeatSelectionScreen = ({ route }) => {
  const navigation = useNavigation();

  const {
    busId = '',
    from = '',
    to = '',
    date = '',
    busName = 'Express Bus',
    price = 900,
    departureTime = '4:30 PM',
  } = route.params || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const seats = Array.from({ length: 30 }, (_, index) => ({
    id: (index + 1).toString(),
  })).concat([
    { id: '31' },
    { id: '32' },
    { id: '33' },
    { id: '34' },
    { id: '35' },
  ]);

  const handleSeatSelection = (seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 5 seats.');
      }
    }
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    const bookingData = {
      busId,
      from,
      to,
      date,
      busName,
      departureTime,
      selectedSeats: selectedSeats.map((s) => s.id),
      totalPrice: selectedSeats.length * price,
      seatCount: selectedSeats.length,
    };

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('BookingDetailsScreen', bookingData);
    }, 1000);
  };

  const totalPrice = selectedSeats.length * price;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: '#003580' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.busName}>{busName}</Text>
          <Text style={styles.route}>{from} → {to}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.seatContainer}>
          <Text style={styles.deckLabel}>Lower Deck</Text>

          <MaterialCommunityIcons
            name="steering"
            size={30}
            color="#555"
            style={{ alignSelf: 'center', marginBottom: 10 }}
          />

          <View style={styles.seatLayout}>
            {Array.from({ length: 10 }).map((_, index) => {
              const seat1 = seats[index * 3];
              const seat2 = seats[index * 3 + 1];
              const seat3 = seats[index * 3 + 2];

              return (
                <View key={`row-${index}`} style={styles.seatRow}>
                  <View style={styles.singleSeat}>
                    {seat1 && (
                      <TouchableOpacity
                        style={[
                          styles.seat,
                          selectedSeats.some((s) => s.id === seat1.id) && styles.selectedSeat,
                        ]}
                        onPress={() => handleSeatSelection(seat1)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            selectedSeats.some((s) => s.id === seat1.id) && styles.selectedSeatText,
                          ]}
                        >
                          {seat1.id}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.doubleSeat}>
                    {seat2 && (
                      <TouchableOpacity
                        style={[
                          styles.seat,
                          selectedSeats.some((s) => s.id === seat2.id) && styles.selectedSeat,
                        ]}
                        onPress={() => handleSeatSelection(seat2)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            selectedSeats.some((s) => s.id === seat2.id) && styles.selectedSeatText,
                          ]}
                        >
                          {seat2.id}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {seat3 && (
                      <TouchableOpacity
                        style={[
                          styles.seat,
                          selectedSeats.some((s) => s.id === seat3.id) && styles.selectedSeat,
                        ]}
                        onPress={() => handleSeatSelection(seat3)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            selectedSeats.some((s) => s.id === seat3.id) && styles.selectedSeatText,
                          ]}
                        >
                          {seat3.id}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            <View style={styles.lastRow}>
              {seats.slice(30).map((seat) => (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seat,
                    selectedSeats.some((s) => s.id === seat.id) && styles.selectedSeat,
                  ]}
                  onPress={() => handleSeatSelection(seat)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.seatText,
                      selectedSeats.some((s) => s.id === seat.id) && styles.selectedSeatText,
                    ]}
                  >
                    {seat.id}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text>Selected Seats: {selectedSeats.map((s) => s.id).join(', ') || 'None'}</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Total Price: ₹{totalPrice}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          (selectedSeats.length === 0 || loading) && styles.disabledButton,
        ]}
        onPress={confirmBooking}
        disabled={selectedSeats.length === 0 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>
            Confirm Your Details
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F0FF' },
  scrollContent: { paddingBottom: 20 },
  header: { height: 160, padding: 20, justifyContent: 'flex-end' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
  headerContent: { marginBottom: 10 },
  busName: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  route: { fontSize: 16, color: 'white' },
  date: { fontSize: 14, color: 'white' },
  seatContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  deckLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  seatLayout: { alignItems: 'center' },
  seatRow: {
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'space-between',
    width: '80%',
  },
  singleSeat: { width: '30%', alignItems: 'flex-start' },
  doubleSeat: { flexDirection: 'row', gap: 10, width: '60%', justifyContent: 'flex-end' },
  seat: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: { fontWeight: '600', fontSize: 12, color: '#333' },
  selectedSeat: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  selectedSeatText: { color: 'white' },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  summaryContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  confirmButton: {
    backgroundColor: '#003580',
    padding: 16,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { opacity: 0.5 },
});

export default SeatSelectionScreen;
