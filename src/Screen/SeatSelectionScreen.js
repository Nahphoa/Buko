import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, Alert,
} from 'react-native';

const SeatSelectionScreen = ({ route }) => {
  const { busId, from, to, date } = route.params;

  const [selectedSeats, setSelectedSeats] = useState([]);

  const seats = [
    [{ id: '1' }, null, { id: '2' }, { id: '3' }],
    [{ id: '4' }, null, { id: '5' }, { id: '6' }],
    [{ id: '7' }, null, { id: '8' }, { id: '9' }],
    [{ id: '10' }, null, { id: '11' }, { id: '12' }],
    [{ id: '13' }, null, { id: '14' }, { id: '15' }],
    [{ id: '16' }, null, { id: '17' }, { id: '18' }],
    [{ id: '19' }, null, { id: '20' }, { id: '21' }],
    [{ id: '22' }, null, { id: '23' }, { id: '24' }],
    [{ id: '25' }, null, { id: '26' }, { id: '27' }],
    [{ id: '28' }, null, { id: '29' }, { id: '30' }],
    [{ id: '31' }, { id: '32' }, { id: '33' }, { id: '34' }, { id: '35' }],
  ];

  const handleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const confirmBooking = () => {
    Alert.alert('Booking Confirmed', `You have booked seats: ${selectedSeats.join(', ') || 'None'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Seats</Text>
      <FlatList
        data={seats}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item: row, index: rowIndex }) => (
          <View style={styles.row}>
            {row.map((seat, seatIndex) => (
              seat ? (
                <TouchableOpacity
                  key={`${rowIndex}-${seatIndex}-${seat.id}`}
                  style={{
                    ...styles.seat,
                    ...(selectedSeats.includes(seat.id) ? styles.selectedSeat : {}),
                  }}
                  onPress={() => handleSeatSelection(seat)}
                >
                  <Text style={styles.seatText}>{seat.id}</Text>
                </TouchableOpacity>
              ) : (
                <View key={`aisle-${rowIndex}-${seatIndex}`} style={styles.aisle} />
              )
            ))}
          </View>
        )}
      />
      <Text style={styles.selectedSeatsText}>Selected: {selectedSeats.join(', ') || 'None'}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seat: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  selectedSeat: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  seatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aisle: {
    width: 20,
  },
  selectedSeatsText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SeatSelectionScreen;
