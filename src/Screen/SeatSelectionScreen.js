import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SeatSelectionScreen = ({ route }) => {
  const navigation = useNavigation();

  const { busId, from, to, date, busName = 'Express Bus', price = 900 } = route.params;
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
    if (selectedSeats.length === 0) {
      Alert.alert('No seats selected', 'Please select at least one seat before proceeding');
      return;
    }
    navigation.navigate('Login', {
      bookingDetails: {
        busId,
        from,
        to,
        date,
        busName,
        selectedSeats,
        totalPrice: selectedSeats.length * price
      }
    });
  };

  const totalPrice = selectedSeats.length * price;

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Back Arrow */}
        
               <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="black" />
             </TouchableOpacity>
       

        <Text style={styles.title}>{busName} - Select Your Seat</Text>
        <Text style={styles.subtitle}>{from} → {to} | {date}</Text>

        <View style={styles.layoutBox}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Lower Deck</Text>
            <MaterialCommunityIcons name="steering" size={32} color="#444" />
          </View>

          <FlatList
            data={seats}
            scrollEnabled={false} // Disable scrolling for FlatList since we're using ScrollView
            keyExtractor={(_, index) => `row-${index}`}
            renderItem={({ item: row, index: rowIndex }) => (
              <View style={styles.row}>
                {row.map((seat, seatIndex) =>
                  seat ? (
                    <TouchableOpacity
                      key={`${rowIndex}-${seatIndex}-${seat.id}`}
                      style={[
                        styles.seat,
                        selectedSeats.includes(seat.id)
                          ? styles.selectedSeat
                          : styles.availableSeat,
                      ]}
                      onPress={() => handleSeatSelection(seat)}
                    >
                      <Text style={styles.seatText}>{seat.id}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View key={`aisle-${rowIndex}-${seatIndex}`} style={styles.aisle} />
                  )
                )}
              </View>
            )}
            contentContainerStyle={styles.seatList}
          />
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.confirmButton,
            selectedSeats.length === 0 && styles.disabledButton
          ]} 
          onPress={confirmBooking}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.confirmText}>
            {selectedSeats.length > 0 ? 'Confirm Booking' : 'Select Seats'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30, // Extra padding at bottom
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  layoutBox: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  seatList: {
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 6,
  },
  aisle: {
    width: 40,
  },
  seat: {
    width: 36,
    height: 36,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 2,
  },
  availableSeat: {
    backgroundColor: '#fff',
    borderColor: 'green',
  },
  selectedSeat: {
    backgroundColor: 'lightgreen',
    borderColor: 'green',
  },
  seatText: {
    fontWeight: '600',
    fontSize: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20, // Added margin at bottom for better scrolling
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SeatSelectionScreen;