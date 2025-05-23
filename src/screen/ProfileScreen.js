import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMenu from './ProfileMenu';// where you have the two buttons
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
    
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} options={{ headerShown: false }} />


     <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
