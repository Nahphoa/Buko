import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

const routes = ["Mon", "Dimapur", "Kohima", "Mokokchung", "Tuensang"];

export default function SelectRouteScreen({ navigation, route }) {
  const { type, from, to } = route.params;
  const [searchText, setSearchText] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(routes);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type === "from" ? "Select Source" : "Select Destination",
      headerStyle: { backgroundColor: "#800080" },
      headerTintColor: "#fff",
    });
  }, [navigation, type]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = routes.filter((route) =>
      route.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <TextInput
        placeholder={type === "from" ? "Search Routes..." : "Search Destination..."}
        value={searchText}
        onChangeText={handleSearch}
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 10,
        }}
      />
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#000000",
            }}
            onPress={() => {
              navigation.navigate("Home", {
                from: type === "from" ? item : from,
                to: type === "to" ? item : to,
              });
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No routes found.
          </Text>
        }
      />
    </View>
  );
}
