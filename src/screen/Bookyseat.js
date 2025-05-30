import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Bookyseat = ({ route }) => {
  const navigation = useNavigation();

  const {
    busName,
    price = 0,
    totalSeats = 35,
    busId = null,
    from,
    to,
    time,
    BusNo,
    travelDate,
  } = route.params || {};

  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load reserved seats for this busId + travelDate + time from Firestore bookings
  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        if (!busId || !travelDate || !time) {
          setReservedSeats([]);
          setLoading(false);
          return;
        }

        // Query bookings where busId, travelDate and time match, and status is confirmed
        const bookingsRef = collection(db, "Booking");
        const q = query(
          bookingsRef,
          where("busId", "==", busId),
          where("travelDate", "==", travelDate),
          where("time", "==", time),
          where("status", "==", "confirmed")
        );

        const querySnapshot = await getDocs(q);
        let bookedSeats = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.selectedSeats && Array.isArray(data.selectedSeats)) {
            bookedSeats = bookedSeats.concat(data.selectedSeats);
          }
        });

        // Remove duplicates and sort
        const uniqueSeats = [...new Set(bookedSeats)];
        setReservedSeats(uniqueSeats);
      } catch (error) {
        console.error("Error fetching reserved seats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservedSeats();
  }, [busId, travelDate, time]);

  const toggleSeatSelection = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBookNow = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat.");
      return;
    }

    const user = auth.currentUser;

    const bookingData = {
      busName,
      busId,
      from,
      to,
      travelDate,
      price,
      time,
      busNumber: BusNo || null,
      selectedSeats,
      totalPrice: selectedSeats.length * price,
      userId: user?.uid || "guest",
      createdAt: serverTimestamp(),
      status: "confirmed",
    };

    try {
      await addDoc(collection(db, "Booking"), bookingData);

      Alert.alert("Booking Confirmed", "Your seats have been booked!");

      if (!user) {
        navigation.navigate("SignUp", {
          redirectTo: "TicketForm",
          bookingData,
        });
      } else {
        navigation.navigate("TicketForm", { bookingData });
      }
    } catch (error) {
      console.error("Booking save failed:", error);
      Alert.alert("Booking Failed", "Please try again.");
    }
  };

  const renderSeat = (seatNumber) => {
    const isReserved = reservedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    return (
      <TouchableOpacity
        key={seatNumber}
        style={[
          styles.seat,
          isReserved
            ? styles.soldSeat
            : isSelected
            ? styles.selectedSeat
            : styles.availableSeat,
        ]}
        onPress={() => toggleSeatSelection(seatNumber)}
        disabled={isReserved}
      >
        <Text style={styles.seatText}>{isReserved ? "X" : seatNumber}</Text>
      </TouchableOpacity>
    );
  };

  const generateSeats = () => {
    const rows = [];
    let seat = 1;

    while (seat <= 30) {
      const row = (
        <View key={seat} style={styles.row}>
          <View style={styles.singleSeat}>{renderSeat(seat++)}</View>
          <View style={styles.aisleSpace} />
          <View style={styles.doubleSeat}>
            {seat <= 30 && renderSeat(seat++)}
            {seat <= 30 && renderSeat(seat++)}
          </View>
        </View>
      );
      rows.push(row);
    }

    if (seat <= 35) {
      const lastRow = (
        <View key="lastRow" style={[styles.row, { justifyContent: "center" }]}>
          {[31, 32, 33, 34, 35].map((s) => (
            <View key={s} style={{ marginHorizontal: 3 }}>
              {renderSeat(s)}
            </View>
          ))}
        </View>
      );
      rows.push(lastRow);
    }

    return rows;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#800080" />
        <Text>Loading seat availability...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{busName}</Text>
      <Text>
        {from} ➞ {to}
      </Text>
      <Text>Travel Date: {travelDate}</Text>

      <View style={styles.layoutBox}>
        <View style={styles.layoutHeader}>
          <View style={styles.lowerLabelContainer}>
            <Text style={styles.layoutLabel}>Lower</Text>
            <Image
              source={require("../Image/steering.jpg")}
              style={styles.steeringIcon}
            />
          </View>
        </View>

        {generateSeats()}
      </View>

      <Text style={styles.totalPrice}>
        Total Price: ₹{selectedSeats.length * price}
      </Text>

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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  layoutBox: {
    borderWidth: 1,
    borderColor: "#800080",
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
    alignItems: "center",
    marginBottom: 10,
  },
  aisleSpace: {
    width: 30,
  },
  singleSeat: {
    flexDirection: "row",
  },
  doubleSeat: {
    flexDirection: "row",
    gap: 6,
  },
  seat: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    marginHorizontal: 3,
  },
  availableSeat: {
    borderColor: "green",
    backgroundColor: "#fff",
  },
  soldSeat: {
    borderColor: "red",
    backgroundColor: "#fdd",
  },
  selectedSeat: {
    borderColor: "#FF7F50",
    backgroundColor: "#FF7F50",
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
    backgroundColor: "#800080",
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