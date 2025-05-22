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
import { useNavigation, useRoute } from '@react-navigation/native';

const SeatSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    busId = '',
    from = '',
    to = '',
    date = '',
    busName = 'Express Bus',
    price = 900,
    departureTime = '4:30 PM',
    user = {},
  } = route.params || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate seats in a structured row layout
  const rows = [];
  let seatNumber = 1;

  // 10 rows of 3 seats (1 single + 2 double)
  for (let i = 0; i < 10; i++) {
    rows.push([
      { id: seatNumber.toString(), type: 'single' },
      { id: (seatNumber + 1).toString(), type: 'double-left' },
      { id: (seatNumber + 2).toString(), type: 'double-right' },
    ]);
    seatNumber += 3;
  }

  // Last row with 5 seats
  const lastRow = [];
  for (let i = 0; i < 5; i++) {
    lastRow.push({ id: (seatNumber + i).toString(), type: 'last-row' });
  }

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

  const proceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    navigation.navigate('PassengerDetails', {
      bus: {
        busId,
        busName,
        from,
        to,
        date,
        departureTime,
        price,
        busNumber: busId,
      },
      selectedSeats: selectedSeats.map(s => s.id),
      user
    });
  };

  const totalPrice = selectedSeats.length * price;

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const isBooked = Math.random() < 0.2; // simulate bookings

    return (
      <TouchableOpacity
        key={seat.id}
        style={[
          styles.seat,
          styles[seat.type],
          isBooked && styles.bookedSeat,
          isSelected && styles.selectedSeat,
        ]}
        onPress={() => !isBooked && handleSeatSelection(seat)}
        disabled={isBooked}
      >
        <Text style={styles.seatText}>{seat.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.busInfoContainer}>
          <Text style={styles.busName}>{busName}</Text>
          <View style={styles.routeContainer}>
            <Text style={styles.routeText}>{from}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="gray" />
            <Text style={styles.routeText}>{to}</Text>
          </View>
          <Text style={styles.departureText}>
            {date} • {departureTime}
          </Text>
        </View>

        <View style={styles.seatLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.availableColor]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.selectedColor]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.bookedColor]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        <View style={styles.seatMap}>
          <View style={styles.driverSeat}>
            <MaterialCommunityIcons name="steering" size={30} color="gray" />
          </View>

          {/* Render seat rows */}
          {rows.map((row, index) => (
            <View key={index} style={styles.seatRow}>
              <View style={styles.singleSeatWrapper}>{renderSeat(row[0])}</View>
              <View style={styles.doubleSeatWrapper}>
                {renderSeat(row[1])}
                {renderSeat(row[2])}
              </View>
            </View>
          ))}

          {/* Last row */}
          <View style={styles.lastRow}>
            {lastRow.map((seat) => renderSeat(seat))}
          </View>
        </View>

        <View style={styles.selectionSummary}>
          <Text style={styles.summaryText}>
            Selected: {selectedSeats.length} seat(s)
          </Text>
          <Text style={styles.summaryText}>
            Total: ₹{totalPrice}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price:</Text>
          <Text style={styles.priceValue}>₹{totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            selectedSeats.length === 0 && styles.disabledButton
          ]}
          onPress={proceedToPassengerDetails}
          disabled={loading || selectedSeats.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.bookButtonText}>
              {selectedSeats.length > 0 ? 
                `Continue (${selectedSeats.length} seat(s))` : 
                'Select Seats'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  busInfoContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  busName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  routeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  routeText: { fontSize: 14, marginHorizontal: 5 },
  departureText: { fontSize: 12, color: 'gray' },
  seatLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    marginBottom: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
  },
  availableColor: { backgroundColor: '#e0e0e0' },
  selectedColor: { backgroundColor: '#4CAF50' },
  bookedColor: { backgroundColor: '#F44336' },
  legendText: { fontSize: 12 },
  seatMap: { padding: 15 },
  driverSeat: { alignItems: 'center', marginBottom: 20 },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  singleSeatWrapper: { marginRight: 20 },
  doubleSeatWrapper: { flexDirection: 'row' },
  seat: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  single: {},
  'double-left': {
    marginRight: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  'double-right': {
    marginLeft: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  'last-row': {
    marginHorizontal: 4,
  },
  selectedSeat: { backgroundColor: '#4CAF50' },
  bookedSeat: { backgroundColor: '#F44336' },
  seatText: { fontSize: 12, fontWeight: 'bold' },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: { flexDirection: 'column' },
  priceLabel: { fontSize: 14, color: 'gray' },
  priceValue: { fontSize: 18, fontWeight: 'bold' },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SeatSelectionScreen;