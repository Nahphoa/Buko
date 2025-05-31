import React, { useEffect, useState, useCallback} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const BusListScreen = ({ route }) => {
  const navigation = useNavigation();
  const { from, to, selectedDate } = route.params;

  const [buses, setBuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBuses = useCallback(async () => {
    try {
      setRefreshing(true); // Start spinner

      const normalizeData = (doc, source) => {
        const data = doc.data();
        return {
          id: doc.id,
          busId: doc.id,
          busName: data.busName || data.busname || "Unnamed Bus",
          busNumber: data.busNumber || "N/A",
          from: source === "manual" ? data.from : data.source,
          to: source === "manual" ? data.to : data.destination,
          totalSeats: data.totalSeats || 40,
          price: data.price || 0,
          time: data.time || "Not specified",
          travelDate: data.travelDate || selectedDate,
        };
      };

      const [adminSnap, manualSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, "buses"),
            where("source", "==", from),
            where("destination", "==", to)
          )
        ),
        getDocs(
          query(
            collection(db, "Buses"),
            where("from", "==", from),
            where("to", "==", to)
          )
        ),
      ]);

      const allBuses = [
        ...adminSnap.docs.map((doc) => normalizeData(doc, "admin")),
        ...manualSnap.docs.map((doc) => normalizeData(doc, "manual")),
      ];

      setBuses(allBuses);
    } catch (error) {
      console.error("Error fetching buses:", error.message);
    } finally {
      setRefreshing(false); // Stop spinner
    }
  }, [from, to, selectedDate]);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const renderBusItem = ({ item }) => (
    <View style={styles.busItem}>
      <Text>Bus Name: {item.busName}</Text>
      <Text>Bus No: {item.busNumber}</Text>
      <Text>Price: ₹{item.price}</Text>
      <Text>Time: {item.time}</Text>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate("Bookyseat", {
            ...item,
            busId: item.id,
          })
        }
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Buses from {from} to {to} on {selectedDate}
      </Text>

      <FlatList
        data={buses}
        keyExtractor={(bus) => bus.id}
        renderItem={renderBusItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchBuses} />
        }
        ListEmptyComponent={
          !refreshing && (
            <Text style={styles.noBusText}>
              No buses found for selected route
            </Text>
          )
        }
      />
    </View>
  );
};

export default BusListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  bookButton: {
    backgroundColor: "#FF7F50",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000000",
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
