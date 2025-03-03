import React, { useState, useEffect } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, Modal, Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation, route }) => {
  const [from, setFrom] = useState(route.params?.from || '');
  const [to, setTo] = useState(route.params?.to || '');
  const [date, setDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    console.log('Received route.params:', route.params); // Debugging
    if (route.params?.from) setFrom(route.params.from);
    if (route.params?.to) setTo(route.params.to);
  }, [route.params?.from, route.params?.to]);

  const handleSearch = () => {
    if (!from.trim() || !to.trim() || !date.trim()) {
      Alert.alert(
        'Error',
        'Please fill in all fields:\n\n' +
        `From: ${from || 'Not selected'}\n` +
        `To: ${to || 'Not selected'}\n` +
        `Date: ${date || 'Not selected'}`
      );
      return;
    }

    const mockBusData = [
      { id: 1, busName: 'Bus A', departureTime: '10:00 AM', from, to, date },
      { id: 2, busName: 'Bus B', departureTime: '12:00 PM', from, to, date },
      { id: 3, busName: 'Bus C', departureTime: '02:00 PM', from, to, date },
    ];

    navigation.navigate('SearchBusScreen', { busData: mockBusData, from, to, date });
  };

  const handleDateSelect = (day) => {
    setDate(day.dateString);
    setCalendarVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date of Travel (DD/MM/YYYY)';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* From Field */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            console.log('Navigating to SelectRouteScreen with:', { type: 'from', from, to }); // Debugging
            navigation.navigate('SelectRouteScreen', { type: 'from', from, to });
          }}
        >
          <Text>{from || 'From'}</Text>
        </TouchableOpacity>

        {/* To Field */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            console.log('Navigating to SelectRouteScreen with:', { type: 'to', from, to }); // Debugging
            navigation.navigate('SelectRouteScreen', { type: 'to', from, to });
          }}
        >
          <Text>{to || 'To'}</Text>
        </TouchableOpacity>

        {/* Date Field */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCalendarVisible(true)}
        >
          <View style={styles.dateInputContent}>
            <Text>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#003580" />
          </View>
        </TouchableOpacity>

        {/* Search Bus Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search Bus</Text>
        </TouchableOpacity>

        {/* Additional Buttons */}
        <View style={styles.additionalButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Navigate to Login Screen"
          >
            <Text style={styles.buttonText}>LogIn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}
            accessibilityLabel="Navigate to Sign Up Screen"
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCalendarVisible(false)}
        >
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [date]: { selected: true, selectedColor: '#003580' },
              }}
              minDate={new Date().toISOString().split('T')[0]}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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