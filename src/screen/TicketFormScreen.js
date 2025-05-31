import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const genders = ["Male", "Female", "Other"];

const TicketFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData } = route.params;

  const {
    selectedSeats = [],
    travelDate,
    from,
    to,
    busName,
    busNumber,
    time,
    price,
    busId,
  } = bookingData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [passengers, setPassengers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(""); // ← Start with no gender selected

  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (!name || !phone || !age) {
      Alert.alert("Missing Info", "Please fill in all the fields.");
      return;
    }

    if (!gender) {
      Alert.alert("Missing Info", "Please select a gender.");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Invalid Phone Number", "Phone number must be exactly 10 digits.");
      return;
    }

    const seatNumber = selectedSeats[currentIndex];

    try {
      const bookingQuery = query(
        collection(db, "Booking"),
        where("userId", "==", user?.uid || null),
        where("seatNumber", "==", seatNumber),
        where("travelDate", "==", travelDate),
        where("busId", "==", busId)
      );

      const querySnapshot = await getDocs(bookingQuery);
      if (!querySnapshot.empty) {
        Alert.alert(
          "Duplicate Booking",
          `Seat ${seatNumber} is already booked for you on this bus and date.`
        );
        return;
      }
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      Alert.alert("Error", "Unable to check for duplicate booking.");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          phone,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving user profile info:", error);
    }

    const passengerData = {
      busId,
      busName,
      busNumber: busNumber || "Not Provided",
      from,
      to,
      time: time || "Not Provided",
      travelDate,
      seatNumber,
      username: name,
      phone,
      age,
      gender,
      price,
      totalPrice: selectedSeats.length * price,
      bookingTime: new Date(),
      userId: user?.uid || null,
      bookingDate: new Date().toLocaleDateString(),
    };

    setPassengers([...passengers, passengerData]);

    if (currentIndex + 1 < selectedSeats.length) {
      setCurrentIndex(currentIndex + 1);
      setName("");
      setPhone("");
      setAge("");
      setGender(""); // Reset gender to force re-selection
    } else {
      try {
        for (let passenger of [...passengers, passengerData]) {
          await addDoc(collection(db, "Booking"), passenger);
        }

        Alert.alert("Success", "Booking confirmed for all passengers!");
        navigation.navigate("MainTab", {
          screen: "BottomTabs",
        });
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
        onChangeText={(text) => {
          const filtered = text.replace(/[^0-9]/g, "");
          setPhone(filtered);
        }}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderContainer}>
        {genders.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.genderButton,
              gender === g && styles.genderButtonSelected,
            ]}
            onPress={() => setGender(g)}
          >
            <Text
              style={[
                styles.genderText,
                gender === g && styles.genderTextSelected,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={currentIndex + 1 < selectedSeats.length ? "Next" : "Confirm Booking"}
        onPress={handleSubmit}
        color="#800080"
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#800080",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#800080",
  },
  genderText: {
    color: "#800080",
    fontWeight: "bold",
  },
  genderTextSelected: {
    color: "#fff",
  },
});
