import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelectRouteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, from = '', to = '' } = route.params; // Default values for `from` and `to`

  // List of locations
  const locations = [
    { id: '1', name: 'Kohima' },
    { id: '2', name: 'Dimapur' },
    { id: '3', name: 'Mon' },
    { id: '4', name: 'Tuensang' },
    { id: '5', name: 'Mokokchung' },
    { id: '6', name: 'Wokha' },
    { id: '7', name: 'Zunheboto' },
    { id: '8', name: 'Phek' },
    { id: '9', name: 'Peren' },
    { id: '10', name: 'Longleng' },
  ];

  // Function to handle location selection
  const handleLocationSelect = (location) => {
    console.log('Selected Location:', location.name);
    console.log('Navigating to Home with:', { from: type === 'from' ? location.name : from, to: type === 'to' ? location.name : to });

    if (type === 'from') {
      navigation.navigate('Main', { screen: 'Home', params: { from: location.name, to } });
    } else {
      navigation.navigate('Main', { screen: 'Home', params: { from, to: location.name } });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003580" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select {type === 'from' ? 'From' : 'To'}</Text>
      </View>

      {/* Location List */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleLocationSelect(item)}
          >
            <Text style={styles.locationText}>{item.name}</Text>
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
  locationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SelectRouteScreen;