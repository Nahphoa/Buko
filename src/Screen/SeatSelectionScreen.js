import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal,
} from 'react-native';

const SeatSelectionScreen = ({ route }) => {
  const { busId, from, to, date, busDetails } = route.params; // Get data from navigation params

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerGender, setPassengerGender] = useState('');
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('debitCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Updated seats data structure
  const seats = [
    // Rows with single seats on the left and double seats on trrhe right
    [
      { id: '1', status: 'available' },
      null, // Represents the aisle
      { id: '2-3', status: 'available', double: true },
    ],
    [
      { id: '4', status: 'available' },
      null, // Represents the aisle
      { id: '5-6', status: 'available', double: true },
    ],
    [
      { id: '7', status: 'available' },
      null, // Represents the aisle
      { id: '8-9', status: 'available', double: true },
    ],
    [
      { id: '10', status: 'available' },
      null, // Represents the aisle
      { id: '11-12', status: 'available', double: true },
    ],
    [
      { id: '13', status: 'available' },
      null, // Represents the aisle
      { id: '14-15', status: 'available', double: true },
    ],
    [
      { id: '16', status: 'available' },
      null, // Represents the aisle
      { id: '17-18', status: 'available', double: true },
    ],
    [
      { id: '19', status: 'available' },
      null, // Represents the aisle
      { id: '20-21', status: 'available', double: true },
    ],
    [
      { id: '22', status: 'available' },
      null, // Represents the aisle
      { id: '23-24', status: 'available', double: true },
    ],
    [
      { id: '25', status: 'available' },
      null, // Represents the aisle
      { id: '26-27', status: 'available', double: true },
    ],
    [
      { id: '28', status: 'available' },
      null, // Represents the aisle
      { id: '29-30', status: 'available', double: true },
    ],
    // Last row with 5 seats
    [
      { id: '31', status: 'available' },
      { id: '32', status: 'available' },
      { id: '33', status: 'available' },
      { id: '34', status: 'available' },
      { id: '35', status: 'available' },
    ],
  ];

  const pricePerSeat = 500;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const handleSeatSelection = (seat) => {
    if (seat.status === 'booked') {
      Alert.alert('Seat Booked', 'This seat is already booked and cannot be selected.');
      return;
    }

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Error', 'Please select at least one seat.');
      return;
    }
    setPaymentModalVisible(true);
  };

  const handlePaymentConfirmation = () => {
    let errorMessage = '';

    switch (paymentMethod) {
      case 'debitCard':
        if (!cardNumber || !expiryDate || !cvv) {
          errorMessage = 'Please fill in all card details.';
        }
        break;
      case 'upi':
        if (!upiId) {
          errorMessage = 'Please enter your UPI ID.';
        }
        break;
      case 'netBanking':
        if (!bankName || !accountNumber) {
          errorMessage = 'Please fill in all bank details.';
        }
        break;
      default:
        errorMessage = 'Please select a valid payment method.';
    }

    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    Alert.alert('Payment Successful', `Booking confirmed for seats: ${selectedSeats.join(', ')}\nTotal Price: ₹${totalPrice}`);
    setPaymentModalVisible(false);
  };

  const handleGenderSelection = (gender) => {
    setPassengerGender(gender);
    setGenderModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Bus Details */}
      <View style={styles.busDetails}>
        <Text style={styles.busDetailsText}>Bus ID: {busId}</Text>
        <Text style={styles.busDetailsText}>From: {from}</Text>
        <Text style={styles.busDetailsText}>To: {to}</Text>
        <Text style={styles.busDetailsText}>Date: {date}</Text>
      </View>

      {/* Passenger Details */}
      <View style={styles.passengerDetails}>
        <Text style={styles.sectionTitle}>Passenger Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={passengerName}
          onChangeText={setPassengerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={passengerAge}
          onChangeText={setPassengerAge}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setGenderModalVisible(true)}
        >
          <Text>{passengerGender || 'Select Gender'}</Text>
        </TouchableOpacity>
      </View>

      {/* Seat Grid */}
      <Text style={styles.sectionTitle}>Select Seats</Text>
      <FlatList
        data={seats}
        keyExtractor={(item, index) => `row-${index}`}
        renderItem={({ item: row, index: rowIndex }) => (
          <View style={styles.row}>
            {row.map((seat, seatIndex) => (
              seat ? (
                <TouchableOpacity
                  key={`${rowIndex}-${seatIndex}-${seat.id}`} // Unique key for each seat
                  style={[
                    styles.seat,
                    seat.status === 'booked' && styles.bookedSeat,
                    selectedSeats.includes(seat.id) && styles.selectedSeat,
                    seat.double && styles.doubleSeat,
                  ]}
                  onPress={() => handleSeatSelection(seat)}
                  disabled={seat.status === 'booked'}
                >
                  {seat.double ? (
                    <View style={styles.doubleSeatContainer}>
                      <Text style={styles.seatText}>{seat.id.split('-')[0]}</Text>
                      <Text style={styles.seatText}>{seat.id.split('-')[1]}</Text>
                    </View>
                  ) : (
                    <Text style={styles.seatText}>{seat.id}</Text>
                  )}
                  <Text style={styles.seatStatus}>
                    {seat.status === 'booked' ? 'Booked' : 'Available'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View key={`aisle-${rowIndex}-${seatIndex}`} style={styles.aisle} />
              )
            ))}
          </View>
        )}
      />

      {/* Selected Seats Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Selected Seats:</Text>
        <Text>{selectedSeats.join(', ') || 'No seats selected'}</Text>
        <Text style={styles.totalPrice}>Total Price: ₹{totalPrice}</Text>
      </View>

      {/* Confirm Booking Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>

      {/* Payment Modal */}
      <Modal
        visible={isPaymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.paymentModal}>
            <Text style={styles.modalTitle}>Payment Details</Text>

            {/* Payment Method Selection */}
            <View style={styles.paymentMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'debitCard' && styles.selectedPaymentMethod,
                ]}
                onPress={() => setPaymentMethod('debitCard')}
              >
                <Text>Debit Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'upi' && styles.selectedPaymentMethod,
                ]}
                onPress={() => setPaymentMethod('upi')}
              >
                <Text>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'netBanking' && styles.selectedPaymentMethod,
                ]}
                onPress={() => setPaymentMethod('netBanking')}
              >
                <Text>Net Banking</Text>
              </TouchableOpacity>
            </View>

            {/* Payment Details */}
            {paymentMethod === 'debitCard' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Expiry Date (MM/YY)"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                />
                <TextInput
                  style={styles.input}
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </>
            )}

            {paymentMethod === 'upi' && (
              <TextInput
                style={styles.input}
                placeholder="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
              />
            )}

            {paymentMethod === 'netBanking' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name"
                  value={bankName}
                  onChangeText={setBankName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="numeric"
                />
              </>
            )}

            {/* Confirm Payment Button */}
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={handlePaymentConfirmation}
            >
              <Text style={styles.paymentButtonText}>Confirm Payment</Text>
            </TouchableOpacity>

            {/* Cancel Payment Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal
        visible={isGenderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.genderModal}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => handleGenderSelection('Male')}
            >
              <Text>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => handleGenderSelection('Female')}
            >
              <Text>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => handleGenderSelection('Others')}
            >
              <Text>Others</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  busDetails: {
    marginBottom: 20,
  },
  busDetailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  passengerDetails: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seat: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  doubleSeat: {
    width: 140, // Double width for double seats
  },
  doubleSeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  bookedSeat: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  selectedSeat: {
    backgroundColor: '#003580',
    borderColor: '#003580',
  },
  seatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatStatus: {
    fontSize: 12,
    color: '#666',
  },
  aisle: {
    width: 20, // Represents the aisle
  },
  summary: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  confirmButton: {
    padding: 15,
    backgroundColor: '#003580',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  paymentModal: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  genderModal: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethodButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedPaymentMethod: {
    borderColor: '#003580',
    backgroundColor: '#e6f0ff',
  },
  paymentButton: {
    padding: 15,
    backgroundColor: '#003580',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SeatSelectionScreen;