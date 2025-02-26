import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import Calendar
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for the calendar icon

const HomeScreen = ({ navigation, route }) => {
  const [from, setFrom] = useState(route.params?.from || '');
  const [to, setTo] = useState(route.params?.to || '');
  const [date, setDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false); // State to control calendar visibility

  // Function to handle search
  const handleSearch = () => {
    if (!from || !to || !date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Mock data for testing
    const mockBusData = [
      { id: 1, busName: 'Bus A', departureTime: '10:00 AM', from, to, date },
      { id: 2, busName: 'Bus B', departureTime: '12:00 PM', from, to, date },
      { id: 3, busName: 'Bus C', departureTime: '02:00 PM', from, to, date },
    ];

    // Navigate to BusListScreen with the search results
    navigation.navigate('BusListScreen', { busData: mockBusData });
  };

  // Function to handle date selection from the calendar
  const handleDateSelect = (day) => {
    setDate(day.dateString); // Update the selected date
    setCalendarVisible(false); // Close the calendar
  };

  // Function to format the date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo */}
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* FROM FIELD */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => navigation.navigate('SelectRouteScreen', { type: 'from' })}
        >
          <Text>{from || 'From'}</Text>
        </TouchableOpacity>

        {/* TO FIELD */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => navigation.navigate('SelectRouteScreen', { type: 'to' })}
        >
          <Text>{to || 'To'}</Text>
        </TouchableOpacity>

        {/* DATE FIELD */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCalendarVisible(true)} // Open the calendar on press
        >
          <View style={styles.dateInputContent}>
            <Text>{date ? formatDate(date) : 'Date of Travel (DD/MM/YYYY)'}</Text>
            <Ionicons name="calendar-outline" size={20} color="#003580" />
          </View>
        </TouchableOpacity>

        {/* SEARCH BUS BUTTON */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search Bus</Text>
        </TouchableOpacity>

        {/* ADDITIONAL BUTTONS */}
        <View style={styles.additionalButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text>LogIn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CALENDAR MODAL */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDateSelect} // Handle date selection
              markedDates={{
                [date]: { selected: true, selectedColor: '#003580' }, // Highlight the selected date
              }}
              minDate={new Date().toISOString().split('T')[0]} // Disable past dates
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    height: 130,
    width: 100,
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateInputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#003580',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  additionalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#003580',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});