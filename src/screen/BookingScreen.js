import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import History from './History';
import BookingMenu from './BookingMenu';


const Stack = createNativeStackNavigator();

const BookingScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingMenu" component={BookingMenu} options={{headerShown:false}}/>
   
      
     <Stack.Screen name="History" component={History} options={{headerShown:true}}/>
  
      
    </Stack.Navigator>
  );
};

export default BookingScreen;
