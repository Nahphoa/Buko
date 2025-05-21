import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelectRouteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Safely extract params with defaults
  const { type = 'from', from = '', to = '' } = route.params || {};

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

  // Improved navigation handler
  const handleLocationSelect = (location) => {
    const params = {
      from: type === 'from' ? location.name : from,
      to: type === 'to' ? location.name : to
    };

    // Navigate back to Home with updated params
    navigation.navigate('Home', params);
  };

  return (
    <View style={styles.container}>
      {/* Header with improved back navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Select {type === 'from' ? 'Departure' : 'Destination'}
        </Text>
      </View>

      {/* Location List with improved UI */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleLocationSelect(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.locationText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003580',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default SelectRouteScreen;