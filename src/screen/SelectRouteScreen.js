import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const routes = ["Mon", "Dimapur", "Kohima", "Mokokchung", "Tuensang"];

export default function SelectRouteScreen({ navigation, route }) {
  const { type, from, to } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type === "from" ? "Select Source" : "Select Destination",
      headerStyle: { backgroundColor: '#003580' }, // optional: header color
      headerTintColor: '#fff', // optional: text/icon color
    });
  }, [navigation, type]);

  return (
    <View style={{ flex: 1, backgroundColor: '#40E0D0', padding: 20 }}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#000000',
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
      />
    </View>
  );
}
