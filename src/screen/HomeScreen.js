import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Alert, View, StatusBar, SafeAreaView } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';

const HomeScreen = ({ navigation, route }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (route.params?.from) setFrom(route.params.from);
    if (route.params?.to) setTo(route.params.to);
  }, [route.params]);

  const handleSearch = () => {
    if (!selectedDate) {
      Alert.alert("Missing Date", "Please select a date of travel");
      return;
    }
    console.log('Searching for buses...');
    console.log('From:', from);
    console.log('To:', to);
    console.log('Date:', selectedDate);

    navigation.navigate("BusList", { from, to, selectedDate });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#003580" barStyle="dark-content" />

      {/* MAIN text on top-left */}
      {/* <View style={styles.mainTextContainer}>
        <Text style={styles.mainText}>MAIN</Text>
      </View> */}

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
      <View style={{ width: '100%', marginVertical: 20 }}>
        <CalendarComponent onSelectDate={setSelectedDate} />
      </View>

      {/* SEARCH BUS BUTTON */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Bus</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 13,
  },
  // mainTextContainer: {
  //   width: '100%',
  //   alignItems: 'flex-start',
  //   marginBottom: 10,
  //   backcolor:'black'

  // },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  logo: {
    height: 130,
    width: 100,
    marginBottom: 40,
    marginTop: 40,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#000000',
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
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
