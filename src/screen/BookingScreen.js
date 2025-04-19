import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingMenu from './BookingMenu'; // where you have the two buttons
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function BookingScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookingMenu" component={BookingMenu} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} option={{
        headerTitle: 'login',
        headerStyle: {
          backgroundColor: 'blue',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'left',
      }} />
      <Stack.Screen name="Signup" component={SignupScreen} option={{headerstyle:{
        setStatusBarBackgroundColor:'Blue'
      },
          headerTintColor: '#fff',
          headerTitleAlign: 'left',
      }}/>
    </Stack.Navigator>
  );
}
