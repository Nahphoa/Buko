import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';

export default class BusListScreen extends Component {
  renderBusItem = ({ item }) => (
    <View style={styles.busItem}>
      <Text style={styles.busName}>{item.busName}</Text>
      <Text style={styles.busDetails}>Departure: {item.departureTime}</Text>
      <Text style={styles.busDetails}>From: {item.from}</Text>
      <Text style={styles.busDetails}>To: {item.to}</Text>
      <Text style={styles.busDetails}>Date: {item.date}</Text>
    </View>
  );

  render() {
    const { busData } = this.props.route.params; // Get busData from navigation params
    console.log('Received busData:', busData); // Debug log

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Available Buses</Text>
        {busData.length > 0 ? (
          <FlatList
            data={busData}
            renderItem={this.renderBusItem}
            keyExtractor={(item) => item.id.toString()}
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