import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

export default class BusListScreen extends Component {
  // Function to handle bus selection
  handleBusSelect = (bus) => {
    console.log('Selected Bus:', bus); // Debugging
    this.props.navigation.navigate('SeatSelectionScreen', {
      busId: bus.id,
      from: bus.from,
      to: bus.to,
      date: bus.date,
      busDetails: bus,
    });
  };

  // Render each bus item
  renderBusItem = ({ item }) => (
    <TouchableOpacity
      style={styles.busItem}
      onPress={() => this.handleBusSelect(item)} // Make the bus item selectable
    >
      <Text style={styles.busName}>{item.busName}</Text>
      <Text style={styles.busDetails}>Departure: {item.departureTime}</Text>
      <Text style={styles.busDetails}>From: {item.from}</Text>
      <Text style={styles.busDetails}>To: {item.to}</Text>
      <Text style={styles.busDetails}>Date: {item.date}</Text>
    </TouchableOpacity>
  );

  render() {
    const { busData } = this.props.route.params; // Get busData from navigation params
    console.log('Received busData:', busData); // Debug log

    // Ensure each bus has a unique key
    const uniqueBusData = busData.map((bus, index) => ({
      ...bus,
      uniqueId: `${bus.id}-${index}`, // Create a unique ID for each bus
    }));

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Available Buses</Text>
        {busData.length > 0 ? (
          <FlatList
            data={uniqueBusData} // Use the modified busData with unique IDs
            renderItem={this.renderBusItem}
            keyExtractor={(item) => item.uniqueId} // Use the uniqueId as the key
          />
        ) : (
          <Text style={styles.noBusesText}>No buses available</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  busItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003580',
  },
  busDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  noBusesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});