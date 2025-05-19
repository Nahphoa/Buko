import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const TicketFormScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params;

  const handleSubmit = () => {
    if (!name || !phone || !age) {
      Alert.alert("Missing Info", "Please fill in all the fields.");
      return;
    }

    const ticketDetails = {
      ...bookingData,
      name,
      phone,
      age,
      gender,
    };

    navigation.navigate("Payment", { ticketDetails });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Passenger Details</Text>

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

      <Button title="Confirm & Pay" onPress={handleSubmit} />
    </View>
  );
};

export default TicketFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center",
  },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10,
    borderRadius: 8, marginBottom: 15,
  },
});
