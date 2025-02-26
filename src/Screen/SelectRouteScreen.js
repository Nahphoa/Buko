import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const SelectRouteScreen = ({ navigation, route }) => {
  const { type, from, to } = route.params; // Get the type ("from" or "to") and current values

  // Updated list of locations
  const locations = [
    { id: '1', name: 'Kohima' },
    { id: '2', name: 'Dimapur' },
    { id: '3', name: 'Mon' },
    { id: '4', name: 'Mokokchung' },
  ];

  // Function to handle location selection
  const handleLocationSelect = (location) => {
    if (type === 'from') {
      navigation.navigate('Home', { from: location.name, to });
    } else {
      navigation.navigate('Home', { from, to: location.name });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select {type === 'from' ? 'From' : 'To'}</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleLocationSelect(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SelectRouteScreen;