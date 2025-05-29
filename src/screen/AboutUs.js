// AboutUs.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>About Buko</Text>
      <Text style={styles.paragraph}>
        Buko is a bus ticket booking platform built to simplify travel across Nagaland and nearby regions. 
        Users can view available buses, book tickets, cancel them with a request, and manage profiles.
      </Text>
      <Text style={styles.paragraph}>
        Admins are route-specific and manage bookings, cancellations, and bus schedules.
      </Text>
      <Text style={styles.paragraph}>
        Built with React Native, Firebase, and Expo, Buko aims to make ticketing smarter, easier, and paperless.
      </Text>
      <Text style={styles.paragraph}>
        For any inquiries or suggestions, please contact us at: support@bukoapp.com
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
});

export default AboutUs;
