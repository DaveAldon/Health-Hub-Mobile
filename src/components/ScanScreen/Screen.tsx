import React, { useEffect, useCallback } from "react";
import { ActivityIndicator, LayoutAnimation, Text, View, TouchableOpacity, FlatList } from "react-native";
import { iDevice } from "../../standards/interfaces";
import DeviceItem from "../DeviceItem";

const ScanDevicesScreen = ({ devices, onClose, onDevicePress, isConnecting, currentDevice }) => {
  return (
    <View style={{ flexDirection: "column" }}>
      {/* <TouchableOpacity style={{height: 20, backgroundColor: "grey"}} onPress={onClose}><Text>Close</Text></TouchableOpacity> */}
      {/* {devices.map(({ name, id }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              console.log("asdasdsad");
            }}
            style={{ height: 50, backgroundColor: "red", marginVertical: 10 }}
          >
            <Text key={id}>
              {name} - {id}
            </Text>
          </TouchableOpacity>
        );
      })} */}
      {
        <FlatList
          data={devices}
          renderItem={({ item, index }: { item: iDevice; index: number }) => (
            <View style={{ marginVertical: 10 }}>
              <DeviceItem key={index} device={item} onSelect={() => onDevicePress(item)} isPairing={isConnecting && item.name === currentDevice?.name} isLastElem={index === devices.length - 1} />
            </View>
          )}
          ListFooterComponent={() => (
            <View>
              <ActivityIndicator color={"black"} />
              <Text>{"Scanning..."}</Text>
            </View>
          )}
        />
      }
    </View>
  );
};

export default ScanDevicesScreen;
