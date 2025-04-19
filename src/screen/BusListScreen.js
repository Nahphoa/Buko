import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import busData from "../../date/busdata";


const BusListScreen = ({ route }) => {
  const navigation = useNavigation();
  const { from, to, selectedDate } = route.params;

  // Find buses matching the selected route
  const buses = busData.find((route) => route.from === from && route.to === to)?.buses || [];

  return (
    <View style={styles.container}>
     

      <Text style={styles.title}>Buses from {from} to {to} on {selectedDate}</Text>

      {buses.length > 0 ? (
        <FlatList
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.busItem}>
              <Text style={styles.busName}>{item.name}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Price: ₹{item.price}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() =>
                  navigation.navigate("Bookyseat", { busId: item.id, busName: item.name, price: item.price })
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
    backgroundColor: "#40E0D0" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  busItem: { padding: 20, borderBottomWidth: 1, marginBottom: 10 },
  busName: { fontSize: 18, fontWeight: "bold" },
  bookButton: { backgroundColor: "#003580", padding: 10, marginTop: 10, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  noBusText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
});
