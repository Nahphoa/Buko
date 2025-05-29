// BookingMenu.js
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
    {
      label: 'Cancel Ticket',
      icon: 'close-circle-outline',
      screen: 'TicketCancel',
    },
    {
      label: 'About Us',
      icon: 'information-circle-outline',
      screen: 'AboutUs', // Make sure this matches the route name in your navigator
    },
     {
      label: 'UpdateTicket',
      icon: 'ticket-circle-outline',
      screen: 'UpdateTicket',
    },
  ];

  return (
     <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Histo')}
      >
        <Ionicons name="time-outline" size={22} color="#003580" style={styles.icon} />
        <Text style={styles.label}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('CancelTicket')}
      >
        <Ionicons name="close-circle-outline" size={22} color="#003580" style={styles.icon} />
        <Text style={styles.label}>Cancel Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('AboutUs')}
      >
        <Ionicons name="information-circle-outline" size={22} color="#003580" style={styles.icon} />
        <Text style={styles.label}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.item}
       onPress={() => navigation.navigate('UpdateTicket')}
      >
        <Ionicons name="calendar-outline" size={22} color="#003580" style={styles.icon} />
        <Text style={styles.label}>Update Ticket</Text>
      </TouchableOpacity>

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