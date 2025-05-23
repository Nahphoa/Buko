import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingMenu = ({ navigation }) => {
  const menuItems = [
    {
      label: 'History',
      icon: 'time-outline',
      screen: 'History',
    },
    
    
  ];

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Ionicons name={item.icon} size={22} color="#003580" style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookingMenu;
