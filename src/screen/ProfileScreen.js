import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMenu from './ProfileMenu';// where you have the two buttons
import LoginScreen from './LoginScreen';
import SignupScreen from './SignUpScreen';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import AdminMenu from './AdminMenu';
import AdminSignup from './AdminSignup';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';

const Stack = createNativeStackNavigator();

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
    
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} options={{ headerShown: false }} />


     <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Signup" component={SignupScreen} />

       <Stack.Screen name="AdminMenu" component={AdminMenu}/>
     <Stack.Screen name="AdminSignup" component={AdminSignup}/>
      <Stack.Screen name="AdminLogin" component={AdminLogin}/>
      <Stack.Screen name="AdminPage" component={AdminPage}/>

    </Stack.Navigator>
  );
}
