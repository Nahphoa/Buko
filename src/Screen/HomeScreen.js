import React, { useState, useEffect } from 'react';
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
    if (route.params?.from) setFrom(route.params.from);
    if (route.params?.to) setTo(route.params.to);
  }, [route.params]);

  const handleSearch = () => {
    if (!from || !to || !date) {
      Alert.alert('Missing Fields', 'Please select From, To, and Date.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const filteredBusData = busData
        .filter((route) => route.from === from && route.to === to)
        .flatMap((route) =>
          route.buses.map((bus) => ({ ...bus, from, to, date }))
        );

      setIsLoading(false);
      navigation.navigate('SearchBusScreen', { 
        busData: filteredBusData, 
        from, 
        to, 
        date 
      });
    }, 1000);
  };

  const handleDateSelect = (day) => {
    setDate(day.dateString);
    setCalendarVisible(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date of Travel (DD/MM/YYYY)';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-GB');
  };

  // Fixed navigation to Profile
  const navigateToProfile = () => {
    navigation.navigate('Main', { screen: 'Profile' });
  };

  // Fixed navigation to Bookings
  const navigateToBookings = () => {
    navigation.navigate('Main', { screen: 'Bookings' });
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />

          <TouchableOpacity
            style={styles.input}
            onPress={() => navigation.navigate('SelectRouteScreen', { type: 'from', from, to })}
          >
            <Text style={from ? styles.selectedText : styles.placeholderText}>
              {from || 'From'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => navigation.navigate('SelectRouteScreen', { type: 'to', from, to })}
          >
            <Text style={to ? styles.selectedText : styles.placeholderText}>
              {to || 'To'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setCalendarVisible(true)}
          >
            <View style={styles.dateInputContent}>
              <Text style={date ? styles.selectedText : styles.placeholderText}>
                {formatDate(date)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#003580" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.disabledButton]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Search Bus</Text>
            )}
          </TouchableOpacity>
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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
        >
          <Ionicons name="home" size={24} color="#003580" />
          <Text style={[styles.navText, { color: '#003580' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={navigateToBookings}
        >
          <Ionicons name="calendar" size={24} color="#666" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={navigateToProfile}
        >
          <Ionicons name="person" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
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
    resizeMode: 'contain',
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
  selectedText: {
    color: '#000',
  },
  placeholderText: {
    color: '#888',
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
  disabledButton: {
    opacity: 0.7,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default HomeScreen;