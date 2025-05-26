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
    
      <Stack.Screen name="ProfileMenu" component={ProfileMenu} options={{ headerShown:false }} />


     <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      <Stack.Screen name="Signup" component={SignupScreen} />

       <Stack.Screen name="AdminMenu" component={AdminMenu} options={{ title: 'Admin Menu'}}/>
     <Stack.Screen name="AdminSignup" component={AdminSignup}options={{ title: 'Admin SignUp'}}/>
      <Stack.Screen name="AdminLogin" component={AdminLogin}options={{ title: 'Admin Login'}}/>
     <Stack.Screen name="AdminPage" component={AdminPage}options={{ title: 'ADMIN PANEL'}}/>

    </Stack.Navigator>
  );
}
