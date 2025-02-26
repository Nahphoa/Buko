import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Screen/HomeScreen';
import BookingScreen from './src/Screen/BookingScreen';
import ProfileScreen from './src/Screen/ProfileScreen';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/Screen/LoginScreen';
import SignUpScreen from './src/Screen/SignUpScreen';
import ForgotPasswordScreen from './src/Screen/ForgotPasswordScreen';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const MyTabs = createBottomTabNavigator();

    function BottomTabs() {
        return (
            <MyTabs.Navigator>
                <MyTabs.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{
                        tabBarLabel: "Home",
                        headerShown: false, 
                        tabBarIcon: ({ focused }) => focused ? (
                            <Entypo name="home" size={24} color="black" />
                        ) : (
                            <AntDesign name="home" size={24} color="black" />
                        )
                    }}
                />
                <MyTabs.Screen 
                    name="Booking" 
                    component={BookingScreen} 
                    options={{
                        tabBarLabel: "Booking",
                        headerShown: false, 
                        tabBarIcon: ({ focused }) => focused ? (
                            <Entypo name="ticket" size={24} color="black" />
                        ) : (
                            <Ionicons name="ticket-outline" size={24} color="black" />
                        )
                    }}
                />
                <MyTabs.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{
                        tabBarLabel: "Profile",
                        headerShown: false, 
                        tabBarIcon: ({ focused }) => focused ? (
                            <Ionicons name="person" size={24} color="#003580" />
                        ) : (
                            <Ionicons name="person-outline" size={24} color="black" />
                        )
                    }}
                />
            </MyTabs.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Main" 
                    component={BottomTabs} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="SignUp" 
                    component={SignUpScreen} 
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigator;

const styles = StyleSheet.create({});