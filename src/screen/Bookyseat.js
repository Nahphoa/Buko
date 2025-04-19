import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig"; // Make sure the path is correct

const Bookyseat = ({ route }) => {
  const navigation = useNavigation();
  const { busName, price } = route.params;

  const totalSeats = 39;
  const reservedSeats = []; // Add reserved seats here if needed
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeatSelection = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((seat) => seat !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };

  const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat before booking.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      navigation.navigate("SignUp"); // Navigates to SignUp screen if user not logged in
    } else {
      Alert.alert(
        "Booking Confirmed",
        `Seats booked: ${selectedSeats.join(", ")}\nTotal: ₹${selectedSeats.length * price}`
      );
      setSelectedSeats([]); // Clear selection after booking
    }
  };

  const totalPrice = selectedSeats.length * price;

  const seatRows = [];
  let seatNum = 1;
  for (let i = 0; i < 9; i++) {
    seatRows.push([seatNum++, "aisle", seatNum++, seatNum++]);
  }
  seatRows.push([seatNum++, seatNum++, seatNum++, seatNum++]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>({busName})</Text>

      {/* Seat Layout Box */}
      <View style={styles.layoutBox}>
        <View style={styles.layoutHeader}>
          <View style={styles.lowerLabelContainer}>
            <Text style={styles.layoutLabel}>Lower</Text>
            <Image source={require("../assets/steering.jpg")} style={styles.steeringIcon} />
          </View>
        </View>

        {/* Seat Layout */}
        {seatRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, index) =>
              item === "aisle" ? (
                <View key={index} style={styles.aisleSpace} />
              ) : (
                <View key={`${route.params.busId}-${item}`} style={styles.seatWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.seat,
                      reservedSeats.includes(item)
                        ? styles.soldSeat
                        : selectedSeats.includes(item)
                        ? styles.selectedSeat
                        : styles.availableSeat,
                    ]}
                    onPress={() => toggleSeatSelection(item)}
                    disabled={reservedSeats.includes(item)}
                  >
                    <Text style={styles.seatText}>
                      {reservedSeats.includes(item) ? "X" : item}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        ))}
      </View>

      {/* Total Price */}
      <Text style={styles.totalPrice}>Total Price: ₹{totalPrice}</Text>

      {/* Book Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Bookyseat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#40E0D0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  layoutBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 15,
    width: "85%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  layoutHeader: {
    width: "100%",
    marginBottom: 50,
  },
  lowerLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  layoutLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  steeringIcon: {
    width: 40,
    height: 50,
    marginLeft: 130,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  seatWrapper: {
    alignItems: "center",
    marginHorizontal: 3,
  },
  aisleSpace: {
    width: 30,
  },
  seat: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
  },
  availableSeat: {
    borderColor: "green",
    backgroundColor: "#fff",
  },
  soldSeat: {
    borderColor: "#ddd",
    backgroundColor: "#f2f2f2",
  },
  selectedSeat: {
    borderColor: "green",
    backgroundColor: "lightgreen",
  },
  seatText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  bookButton: {
    backgroundColor: "green",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
