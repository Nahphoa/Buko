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
      'Mon-Dimapur': { departureTime: '4:30 PM', arrivalTime: '5:00 AM', number: "NL 01 2476" },
      'Dimapur-Mon': { departureTime: '4:30 PM', arrivalTime: '5:00 AM', number: "NL 07 5836" },

      'Mon-Kohima': { departureTime: '4:30 PM', arrivalTime: '6:00 AM', number: "NL 04 9031" },
      'Kohima-Mon': { departureTime: '3:00 PM', arrivalTime: '5:00 AM', number: "NL 07 5836" },

      'Mon-Tuensang': { departureTime: '4:00 PM', arrivalTime: '7:30 AM', number: "NL 01 2476" },
      'Tuensang-Mon': { departureTime: '4:00 PM', arrivalTime: '7:30 AM', number: "NL 07 5836" },

      'Mon-Mokokchung': { departureTime: '3:30 PM', arrivalTime: '6:00 AM', number: "NL 02 2299" },
      'Mokokchung-Mon': { departureTime: '3:30 PM', arrivalTime: '6:00 AM', number: "NL 05 1077" },

      'Mon-Wokha': { departureTime: '4:00 PM', arrivalTime: '5:30 AM', number: "NL 06 4321" },
      'Wokha-Mon': { departureTime: '4:00 PM', arrivalTime: '5:30 AM', number: "NL 06 5543" },

      'Mon-Phek': { departureTime: '4:30 PM', arrivalTime: '6:30 AM', number: "NL 09 7733" },
      'Phek-Mon': { departureTime: '4:30 PM', arrivalTime: '6:30 AM', number: "NL 03 2277" },

      'Mon-Longleng': { departureTime: '3:00 PM', arrivalTime: '4:30 AM', number: "NL 01 8888" },
      'Longleng-Mon': { departureTime: '3:00 PM', arrivalTime: '4:30 AM', number: "NL 07 1212" },

      'Dimapur-Kohima': { departureTime: '2:30 PM', arrivalTime: '5:00 PM', number: "NL 07 5836" },
      'Kohima-Dimapur': { departureTime: '3:00 PM', arrivalTime: '5:30 PM', number: "NL 05 9999" },

      'Tuensang-Mokokchung': { departureTime: '4:00 PM', arrivalTime: '6:00 AM', number: "NL 03 3434" },
      'Mokokchung-Tuensang': { departureTime: '4:00 PM', arrivalTime: '6:00 AM', number: "NL 04 5678" },

      'Wokha-Phek': { departureTime: '5:00 PM', arrivalTime: '7:00 AM', number: "NL 09 3434" },
      'Phek-Wokha': { departureTime: '5:00 PM', arrivalTime: '7:00 AM', number: "NL 10 7777" },

      'Longleng-Tuensang': { departureTime: '4:15 PM', arrivalTime: '6:30 AM', number: "NL 11 5566" },
      'Tuensang-Longleng': { departureTime: '4:15 PM', arrivalTime: '6:30 AM', number: "NL 12 7788" },
    };

    const key = `${from}-${to}`;
    return routeTimings[key] || { departureTime: '4:30 PM', arrivalTime: 'Unknown', number: 'N/A' };
  };

  const timing = getTimings(from, to);

  const uniqueBusData = (busData || []).map((bus, index) => ({
    ...bus,
    uniqueId: `${bus.id}-${index}`,
    departureTime: timing.departureTime,
    arrivalTime: timing.arrivalTime,
    busNumber: timing.number,
    from,
    to,
    date: selectedDate,
  }));

  const handleBusSelect = (bus) => {
    navigation.navigate('SeatSelectionScreen', {
      busId: bus.id,
      from,
      to,
      date: selectedDate,
      busDetails: bus,
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
