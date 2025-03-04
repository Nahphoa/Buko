import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';

const HomeScreen = ({ navigation, route }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Update state when navigating back with selected values
  useEffect(() => {
    if (route.params?.from) setFrom(route.params.from);
    if (route.params?.to) setTo(route.params.to);
  }, [route.params]);

  const handleSearch = () => {
    console.log('Searching for buses...');
    console.log('From:', from);
    console.log('To:', to);
    console.log('Date:', selectedDate);
    
    console.log("Navigating to BusList...");
    console.log("Available Screens:", navigation.getState()?.routeNames);
    navigation.navigate("BusList", { from, to, selectedDate });
     
    };
    
  
  

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      {/* FROM FIELD */}
      <TouchableOpacity 
        style={styles.input}
        onPress={() => navigation.navigate("SelectRoute", { type: "from", from, to })}
      >
        <Text>{from || "From"}</Text>
      </TouchableOpacity>

      {/* TO FIELD */}
      <TouchableOpacity 
        style={styles.input}
        onPress={() => navigation.navigate("SelectRoute", { type: "to", from, to })}
      >
        <Text>{to || "To"}</Text>
      </TouchableOpacity>

      {/* DATE FIELD */}
      <View style={styles.container}>
        <CalendarComponent onSelectDate={setSelectedDate} />
      </View>

      {/* SEARCH BUS BUTTON */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Bus</Text>
      </TouchableOpacity>

      <View style={styles.additionalButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4C4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
  },
  logo: {
    height: 130,
    width: 100,
    marginBottom: 70,
    marginTop: 80,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  searchButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#003580',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 75,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  additionalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginTop: 5,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 45,
    alignItems: 'center',
    marginBottom: 45,
    marginHorizontal: 5,
  },
});
