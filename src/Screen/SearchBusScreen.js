import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SearchBusScreen = ({ route }) => {
  const { busData, from, to, date } = route.params || {};
  const navigation = useNavigation();

  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const selectedDate = date || defaultDate;

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not selected';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const getTimings = (from, to) => {
    const routeTimings = {
      'Kohima-Mon': [
        { departureTime: '6:00 AM', arrivalTime: '5:30 PM', number: 'NL 07 5836' },
        { departureTime: '3:00 PM', arrivalTime: '5:00 AM', number: 'NL 08 1234' },
        { departureTime: '7:00 PM', arrivalTime: '7:00 AM', number: 'NL 09 5678' },
      ],
      'Mon-Kohima': [
        { departureTime: '5:30 AM', arrivalTime: '4:30 PM', number: 'NL 07 8888' },
        { departureTime: '4:30 PM', arrivalTime: '6:00 AM', number: 'NL 04 9031' },
      ],
      'Dimapur-Mon': [
        { departureTime: '4:30 PM', arrivalTime: '5:00 AM', number: 'NL 07 5836' },
        { departureTime: '6:00 AM', arrivalTime: '6:00 PM', number: 'NL 02 2222' },
      ],
      // Add more routes with arrays of unique timings
    };

    const key = `${from}-${to}`;
    return routeTimings[key] || [
      { departureTime: '4:30 PM', arrivalTime: 'Unknown', number: 'N/A' },
    ];
  };

  const routeTimingList = getTimings(from, to);

  const uniqueBusData = (busData || []).map((bus, index) => {
    const timing = routeTimingList[index % routeTimingList.length];
    return {
      ...bus,
      uniqueId: `${bus.id}-${index}`,
      departureTime: timing.departureTime,
      arrivalTime: timing.arrivalTime,
      busNumber: timing.number,
      from,
      to,
      date: selectedDate,
    };
  });

  const handleBusSelect = (bus) => {
    navigation.navigate('SeatSelectionScreen', {
      busId: bus.id,
      from: bus.from,
      to: bus.to,
      date: bus.date,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      busNumber: bus.busNumber,
      busName: bus.busName,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>

      <Text style={styles.title}>
        Buses from {from} to {to} on {formatDate(selectedDate)}
      </Text>

      {uniqueBusData.length > 0 ? (
        <FlatList
          data={uniqueBusData}
          keyExtractor={(item) => item.uniqueId}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.busItem} onPress={() => handleBusSelect(item)}>
              <Text style={styles.busName}>{item.busName}</Text>
              <Text style={styles.busInfo}>Bus No: {item.busNumber}</Text>
              <Text style={styles.busInfo}>From: {item.from}</Text>
              <Text style={styles.busInfo}>To: {item.to}</Text>
              <Text style={styles.busInfo}>Date: {formatDate(item.date)}</Text>
              <Text style={styles.busInfo}>Departure: {item.departureTime}</Text>
              <Text style={styles.busInfo}>Arrival: {item.arrivalTime}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noBusesText}>No buses found for the selected route and date.</Text>
      )}
    </View>
  );
};

export default SearchBusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F0FE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#003580',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  busItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  busName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#003580',
  },
  busInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  noBusesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
