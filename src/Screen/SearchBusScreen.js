
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBusScreen = ({ route }) => {
  const { busData, from, to, date } = route.params;
  const navigation = useNavigation();

  console.log('Received data in SearchBusScreen:', { busData, from, to, date }); // Debugging

  // Function to format the date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'Date of Travel (DD/MM/YYYY)';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Ensure each bus has a unique key
  const uniqueBusData = busData.map((bus, index) => ({
    ...bus,
    uniqueId: `${bus.id}-${index}`, // Create a unique ID for each bus
  }));

  // Function to handle bus selection
  const handleBusSelect = (bus) => {
    console.log('Selected Bus:', bus); // Debugging
    navigation.navigate('SeatSelectionScreen', {
      busId: bus.id,
      from,
      to,
      date,
      busDetails: bus,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003580" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Buses from {from} to {to} on {formatDate(date)}
      </Text>

      {/* Bus List */}
      {busData.length > 0 ? (
        <FlatList
          data={uniqueBusData} // Use the modified busData with unique IDs
          keyExtractor={(item) => item.uniqueId} // Use the uniqueId as the key
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.busItem}
              onPress={() => handleBusSelect(item)} // Make the bus item selectable
            >
              <Text style={styles.busName}>{item.busName}</Text>
              <Text style={styles.busInfo}>Departure: {item.departureTime}</Text>
              <Text style={styles.busInfo}>From: {item.from}</Text>
              <Text style={styles.busInfo}>To: {item.to}</Text>
              <Text style={styles.busInfo}>Date: {formatDate(item.date)}</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
