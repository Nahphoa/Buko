import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BusListScreen = ({ route }) => {
  const navigation = useNavigation();
  const { from, to, selectedDate } = route.params;

  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // Fetch from 'buses' collection (admin-added)
        const busesQuery = query(
          collection(db, "buses"),
          where("source", "==", from),
          where("destination", "==", to)
        );
        const busesSnapshot = await getDocs(busesQuery);
        const busesData = busesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch from 'Buses' collection (manually added)
        const busesAltQuery = query(
          collection(db, "Buses"),
          where("from", "==", from),
          where("to", "==", to)
        );
        const busesAltSnapshot = await getDocs(busesAltQuery);
        const busesAltData = busesAltSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Merge both
        const allBuses = [...busesData, ...busesAltData];
        setBuses(allBuses);
      } catch (error) {
        console.error("Error fetching buses:", error.message);
      }
    };

    fetchBuses();
  }, [from, to]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Buses from {from} to {to} on {selectedDate}
      </Text>

      {buses.length > 0 ? (
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.busItem}>
              <Text>Bus Name: {item.busname || item.busName}</Text>
              <Text>Price: ₹{item.price}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Bus.No: {item.BusNo || item.busNumber}</Text>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate("Bookyseat", {
                    busId: item.id,
                    busName: item.busname || item.busName,
                    price: item.price,
                    totalSeats: Number(item.totalSeats),
                    BusNo: item.BusNo || item.busNumber,
                    from: item.from || item.source,
                    to: item.to || item.destination,
                    travelDate: item.travelDate || selectedDate,
                  })
                }
              >
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noBusText}>Please select the Routes</Text>
      )}
    </View>
  );
};

export default BusListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#40E0D0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  busItem: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: "#003580",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  noBusText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});
