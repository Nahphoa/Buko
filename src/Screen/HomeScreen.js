import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView,
  Platform, Modal, Alert, ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import busData from './Data/busdata';

const HomeScreen = ({ navigation, route }) => {
  const [from, setFrom] = useState(route.params?.from || '');
  const [to, setTo] = useState(route.params?.to || '');
  const [date, setDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Received route.params:', route.params);
    if (route.params?.from) setFrom(route.params.from);
    if (route.params?.to) setTo(route.params.to);
  }, [route.params?.from, route.params?.to]);

  const handleSearch = useCallback(() => {
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

    setIsLoading(true);

    setTimeout(() => {
      const filteredBusData = busData
        .filter((route) => route.from === from && route.to === to)
        .flatMap((route) => route.buses.map((bus) => ({ ...bus, from, to, date })));

      console.log('Filtered busData:', filteredBusData);

      setIsLoading(false);
      navigation.navigate('SearchBusScreen', { busData: filteredBusData, from, to, date });
    }, 1000);
  }, [from, to, date, navigation]);

  const handleDateSelect = useCallback((day) => {
    setDate(day.dateString);
    setCalendarVisible(false);
  }, []);

  const formatDate = useMemo(() => (dateString) => {
    if (!dateString) return 'Date of Travel (DD/MM/YYYY)';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        <TouchableOpacity
          style={styles.input}
          onPress={() => navigation.navigate('SelectRouteScreen', { type: 'from', from, to })}
          accessibilityLabel="Select departure location"
          accessibilityHint="Tap to select where you are traveling from"
        >
          <Text>{from || 'From'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => navigation.navigate('SelectRouteScreen', { type: 'to', from, to })}
          accessibilityLabel="Select destination location"
          accessibilityHint="Tap to select where you are traveling to"
        >
          <Text>{to || 'To'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setCalendarVisible(true)}
          accessibilityLabel="Select travel date"
          accessibilityHint="Tap to select the date of travel"
        >
          <View style={styles.dateInputContent}>
            <Text>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#003580" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}
          accessibilityLabel="Search for buses"
          accessibilityHint="Tap to search for available buses"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Search Bus</Text>
          )}
        </TouchableOpacity>
      </View>

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
              accessibilityLabel="Close calendar"
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
