import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const TicketFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params;

  // Destructure all relevant fields
  const {
    selectedSeats = [],
    travelDate,
    from,
    to,
    busName,
    busNumber,
    time,
    price,
    busId
  } = bookingData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [passengers, setPassengers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  const handleSubmit = async () => {
    if (!name || !phone || !age) {
      Alert.alert("Missing Info", "Please fill in all the fields.");
      return;
    }

    const passengerData = {
      busId,
      busName,
      busNumber: busNumber || "Not Provided",
      from,
      to,
      time: time || "Not Provided",
      travelDate,
      seatNumber: selectedSeats[currentIndex],
      userName: name,
      phone,
      age,
      gender,
      price,
      totalPrice: selectedSeats.length * price,
      bookingTime: new Date(),
    };

    setPassengers([...passengers, passengerData]);

    if (currentIndex + 1 < selectedSeats.length) {
      // Move to next passenger form
      setCurrentIndex(currentIndex + 1);
      setName("");
      setPhone("");
      setAge("");
      setGender("Male");
    } else {
      // Final submission
      try {
        for (let passenger of [...passengers, passengerData]) {
          await addDoc(collection(db, "Booking"), passenger);
        }
        Alert.alert("Success", "Booking confirmed for all passengers!");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Error saving booking:", error);
        Alert.alert("Error", "Something went wrong while saving booking.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Passenger {currentIndex + 1} of {selectedSeats.length}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Button
        title={
          currentIndex + 1 < selectedSeats.length ? "Next" : "Confirm Booking"
        }
        onPress={handleSubmit}
      />
    </View>
  );
};

export default TicketFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});
