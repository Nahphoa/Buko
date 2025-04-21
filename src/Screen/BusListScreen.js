import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

export default class BusListScreen extends Component {
  handleBusSelect = (bus) => {
    const { from, to, selectedDate } = this.props.route.params;

    const busDetails = {
      busId: bus.id,
      busName: bus.name,
      busNumber: bus.number,
      departureTime: bus.time,
      price: bus.price,
      from,
      to,
      date: selectedDate,
    };

    console.log('Selected Bus Details:', busDetails);

    this.props.navigation.navigate('SeatSelectionScreen', busDetails);
  };

  renderBusItem = ({ item }) => (
    <TouchableOpacity
      style={styles.busItem}
      onPress={() => this.handleBusSelect(item)}
    >
      <Text style={styles.busName}>{item.name}</Text>
      <Text style={styles.busDetails}>Number: {item.number}</Text>
      <Text style={styles.busDetails}>Departure: {item.time}</Text>
      <Text style={styles.busDetails}>Price: ₹{item.price}</Text>
    </TouchableOpacity>
  );

  render() {
    const { buses = [], from, to } = this.props.route.params;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Buses from {from} to {to}
        </Text>
        {buses.length > 0 ? (
          <FlatList
            data={buses}
            renderItem={this.renderBusItem}
            keyExtractor={(item) => item.id}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#003580',
  },
  busItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  busDetails: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  noBusesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
