// ProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMenu from './ProfileMenu';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import AdminMenu from './AdminMenu';
import AdminSignup from './AdminSignup';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Sign Up' }} />
      <Stack.Screen name="AdminMenu" component={AdminMenu} options={{ headerShown: false }} />
      <Stack.Screen name="AdminSignup" component={AdminSignup} options={{ title: 'Admin Sign Up' }} />
      <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ title: 'Admin Login' }} />
      <Stack.Screen name="AdminPage" component={AdminPage} options={{ title: 'Admin Page' }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
