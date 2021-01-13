import React, { useEffect, useCallback, useState } from "react";
import useBleScanning from "../../ble/useBleScanning";
import useBleConnection from "../../ble/useBleConnection";
import ScanDevicesScreen from "./Screen";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { iDevice } from "../../standards/interfaces";

const ScanDevicesScreenContainer = ({ onDeviceConnected, onClose }) => {
  const { devices, startScanning, stopScanning } = useBleScanning();
  const [allowScan, setAllowScan] = useState(false);
  //console.log("here", devices);

  const [textValue, setTextValue] = useState("");

  const { isConnected, isConnecting, connectToDevice, stopConnecting, currentDevice } = useBleConnection();

  useEffect(() => {
    if (allowScan) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [startScanning, allowScan]);

  // we have connected to a new device
  useEffect(() => {
    if (isConnected && currentDevice !== null) {
      onDeviceConnected(currentDevice);
    }
  }, [isConnected, currentDevice, onDeviceConnected]);

  // stop connecting on unmount
  useEffect(() => {
    return () => stopConnecting();
  }, [stopConnecting]);

  function onDevicePress(device: iDevice) {
    if (!isConnecting) {
      console.log(`connect To Device: ${device.name}`);
      connectToDevice(device);
    }
  }

  return (
    <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, padding: 5, borderRadius: 10 }}
        onChangeText={(text) => setTextValue(text)}
        value={textValue}
        placeholder={"Service UUID"}
        placeholderTextColor={"gray"}
      />
      <TouchableOpacity
        style={{ backgroundColor: "green", width: 100, height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          setAllowScan(true);
        }}
      >
        <Text style={{ color: "white" }}>Start Scan</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, width: "100%" }}>
        <ScanDevicesScreen devices={devices} onClose={onClose} onDevicePress={onDevicePress} isConnecting={isConnecting} currentDevice={currentDevice} />
      </View>
    </View>
  );
};

//

export default ScanDevicesScreenContainer;
