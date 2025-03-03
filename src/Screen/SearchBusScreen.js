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
          data={busData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.busItem}>
              <Text style={styles.busName}>{item.busName}</Text>
              <Text style={styles.busInfo}>Departure: {item.departureTime}</Text>
              <Text style={styles.busInfo}>From: {item.from}</Text>
              <Text style={styles.busInfo}>To: {item.to}</Text>
              <Text style={styles.busInfo}>Date: {formatDate(item.date)}</Text>
            </View>
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