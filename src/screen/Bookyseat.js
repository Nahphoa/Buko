import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";

const Bookyseat = ({ route }) => {
  const navigation = useNavigation();
  const { busName, price = 0, totalSeats, busId } = route.params || {};
  const parsedTotalSeats = Number(totalSeats) || 40;

  const reservedSeats = []; // Add any reserved seat numbers here
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

    const bookingData = {
      busName,
      price,
      selectedSeats,
      totalPrice: selectedSeats.length * price,
      busId,
    };

    const user = auth.currentUser;

    if (!user) {
      // Redirect to signup if not logged in
      navigation.navigate("SignUp", {
        redirectTo: "TicketFormScreen",
        bookingData,
      });
    } else {
      // Go to ticket form if logged in
      navigation.navigate("TicketForm", { bookingData });
    }
  };

  const totalPrice = selectedSeats.length * price;

  const seatRows = [];
  let seatNum = 1;
  while (seatNum <= parsedTotalSeats) {
    const row = [];
    if (seatNum <= parsedTotalSeats) row.push(seatNum++);
    if (seatNum <= parsedTotalSeats) row.push(seatNum++);
    row.push("aisle");
    if (seatNum <= parsedTotalSeats) row.push(seatNum++);
    if (seatNum <= parsedTotalSeats) row.push(seatNum++);
    seatRows.push(row);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{busName}</Text>

      <View style={styles.layoutBox}>
        <View style={styles.layoutHeader}>
          <View style={styles.lowerLabelContainer}>
            <Text style={styles.layoutLabel}>Lower</Text>
            <Image
              source={require("../assets/steering.jpg")}
              style={styles.steeringIcon}
            />
          </View>
        </View>

        {seatRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, index) =>
              item === "aisle" ? (
                <View key={index} style={styles.aisleSpace} />
              ) : (
                <View key={`${busId || "bus"}-${item}`} style={styles.seatWrapper}>
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

      <Text style={styles.totalPrice}>Total Price: ₹{totalPrice}</Text>

      <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
        <Text style={styles.buttonText}>Proceed</Text>
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
    marginBottom: 10,
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
    marginBottom: 40,
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
    marginLeft: "auto",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
