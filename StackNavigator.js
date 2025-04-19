import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./src/screen/HomeScreen";
import BookingScreen from "./src/screen/BookingScreen";
import ProfileScreen from "./src/screen/ProfileScreen";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import SelectRouteScreen from './src/screen/SelectRouteScreen';
import LoginScreen from './src/screen/LoginScreen';
import SignUpScreen from './src/screen/SignUpScreen';
import BusListScreen from './src/screen/BusListScreen';
import Bookyseat from './src/screen/Bookyseat';
import BookingMenu from './src/screen/BookingMenu';

const StackNavigator = () => {
  const MyTabs = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function BottomTabs() {
    return (
      <MyTabs.Navigator>
        <MyTabs.Screen name="Home"
          component={HomeScreen} options={{
            tabBarLabel: "Home",
            headerShown: false, tabBarIcon: ({ focused }) => focused ? (
              <Entypo name="home" size={24} color="#003580" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            )
          }}
        />
<MyTabs.Screen name="profile"
          component={ProfileScreen} options={{
            tabBarLabel: "Profile",
            headerShown: false, tabBarIcon: ({ focused }) => focused ? (
              <Ionicons name="person" size={24} color="#003580" />
            ) : (
              <Ionicons name="person-add-outline" size={24} color="black" />
            )
          }}
        />
        <MyTabs.Screen name="Bookings"
          component={BookingScreen} options={{
            tabBarLabel: "Bookings",
            headerShown: false, tabBarIcon: ({ focused }) => focused ? (
              <Entypo name="ticket" size={24} color="#003580" />
            ) : (
              <Ionicons name="ticket-outline" size={24} color="black" />
            )
          }}
        />
      </MyTabs.Navigator>
    )
  }
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={BottomTabs}/>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectRoute" component={SelectRouteScreen} />
      
      <Stack.Screen name ="SignUp" component={SignUpScreen} />
      <Stack.Screen name ="BusList" component={BusListScreen}/>
      <Stack.Screen name ="Bookyseat" component={Bookyseat}/>
      <Stack.Screen name ="Booking" component={BookingScreen} option ={{headerShown:false}} />
      
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})