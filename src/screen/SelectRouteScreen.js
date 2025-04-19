import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const routes = ["Mon", "Dimapur", "Kohima", "Mokokchung", "Tuensang"];

export default function SelectRouteScreen({ navigation, route }) {
  const { type, from, to } = route.params; // "from" or "to"

  return (
    <View style={{ flex: 1,backgroundColor: '#40E0D0', padding: 20 }}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
               padding: 20, 
              borderBottomWidth: 1, 
            
            }}
            onPress={() => {
              navigation.navigate("Home", {
                from: type === "from" ? item : from, 
                to: type === "to" ? item : to
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

