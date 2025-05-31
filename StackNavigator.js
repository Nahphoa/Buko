// App.js or StackNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import MainTab from './MainTab';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import ForgotPasswordScreen from './src/screen/ForgotPasswordScreen';
import SelectRouteScreen from './src/screen/SelectRouteScreen';
import BusListScreen from './src/screen/BusListScreen';
import Bookyseat from './src/screen/Bookyseat';
import TicketFormScreen from './src/screen/TicketFormScreen';
import AdminSignup from './src/screen/AdminSignup';
import AdminLogin from './src/screen/AdminLogin';
import History from './src/screen/History';
import CancelTicketRequestScreen from './src/screen/CancelTicketRequestScreen.js';
import AboutUs from './src/screen/AboutUs';
import UpdateTicket from './src/screen/UpdateTicket';
import AdminPage from './src/screen/AdminPage'; 
import AdminMenu from './src/screen/AdminMenu.js';
import ProfileMenu from './src/screen/ProfileMenu.js';

// import AuthLoading from './AuthLoading';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#800080' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Bottom Tabs with Home, Booking, Profile */}
        <Stack.Screen name="MainTab" component={MainTab} options={{ headerShown: true,  title:'Main' }} />

        {/* All other screens — NO bottom tabs */}
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{title:'Forgot Password'}}/>
        <Stack.Screen name="SelectRoute" component={SelectRouteScreen} />

        <Stack.Screen name="BusList" component={BusListScreen} />
        <Stack.Screen name="Bookyseat" component={Bookyseat} />
        <Stack.Screen name="TicketForm" component={TicketFormScreen} />
        <Stack.Screen name="AdminLog" component={AdminLogin} options={{title:'Admin Login'}} />
        <Stack.Screen name="AdminPage" component={AdminPage}  options={{title:'Admin Panel'}}/>
        <Stack.Screen name="AdminMenu" component={AdminMenu}  options={{title:'Admin Menu'}}/>
         <Stack.Screen name="AdminSign" component={AdminSignup}options={{title:'Admin SignUp'}}/>
         <Stack.Screen name="Histo" component={History} options={{title:'Booking History'}} />
        <Stack.Screen name="CancelTicket" component={CancelTicketRequestScreen}/>
         <Stack.Screen name="AboutUs" component={AboutUs} />
         <Stack.Screen name="UpdateTicket" component={UpdateTicket} />
         <Stack.Screen name="ProfileMenu" component={UpdateTicket} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
