import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { IProp, iDevice } from "../standards/interfaces";
import { useBleConnectionContext } from "../ble/bleConnectionContext";
import AntDesign from "react-native-vector-icons/AntDesign";

const DeviceDisplay = ({ currentDevice, isConnected }: { currentDevice: iDevice; isConnected: boolean }) => {
  return (
    <View style={{ backgroundColor: isConnected ? "green" : "red", padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
      <Text style={{ color: "white" }}>{currentDevice?.name || <AntDesign name="disconnect" size={24} color="white" />}</Text>
    </View>
  );
};

export function Header(props: IProp) {
  const { state } = useBleConnectionContext();

  return (
    <View style={{ height: 50, backgroundColor: "white", justifyContent: "center", flexDirection: "row", alignItems: "center", paddingHorizontal: 5 }}>
      <TouchableOpacity
        style={{ left: 0, position: "absolute" }}
        onPress={() => {
          props.navigation.openDrawer();
        }}
      >
        <Entypo name="menu" size={40} color="black" />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{/* Health Hub */}</Text>
      {/* <AntDesign name="heart" size={35} color="black" /> */}
      <View style={{ right: 0, position: "absolute", padding: 5 }}>
        <DeviceDisplay {...state} />
      </View>
    </View>
  );
}
