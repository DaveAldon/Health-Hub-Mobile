import React, { useEffect, useCallback } from "react";
import { ActivityIndicator, LayoutAnimation, Text, View, TouchableOpacity } from "react-native";
import DeviceItem from "../DeviceItem";
import { Container, ExitButton, Scanning, ScanningText, List } from "./styled";

const LayoutAnimOpacity = {
  duration: 150,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

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
        <List
          data={devices}
          renderItem={({ item, index }) => (
            <View style={{ marginVertical: 10 }}>
              <DeviceItem key={index} name={item.name} onSelect={() => onDevicePress(item)} isPairing={isConnecting && item.name === currentDevice?.name} isLastElem={index === devices.length - 1} />
            </View>
          )}
          ListFooterComponent={() => (
            <Scanning>
              <ActivityIndicator color={"black"} />
              <Text>{"Scanning..."}</Text>
            </Scanning>
          )}
        />
      }
    </View>
  );
};

export default ScanDevicesScreen;
