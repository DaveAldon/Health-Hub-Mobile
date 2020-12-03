import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { IProp } from "../standards/interfaces";

export function Header(props: IProp) {
  return (
    <View style={{ height: 50, backgroundColor: "white", justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingHorizontal: 5 }}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.openDrawer();
        }}
      >
        <Entypo name="menu" size={40} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Health Hub</Text>
      <AntDesign name="heart" size={35} color="white" />
    </View>
  );
}
