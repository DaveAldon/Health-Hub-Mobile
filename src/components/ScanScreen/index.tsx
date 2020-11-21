import React, { useEffect, useCallback } from "react";
import useBleScanning from "../../ble/useBleScanning";
import useBleConnection from "../../ble/useBleConnection";
import ScanDevicesScreen from "./Screen";
import { View, Text } from "react-native";
import { iDevice } from "../../types/interfaces";

const ScanDevicesScreenContainer = ({ onDeviceConnected, onClose }) => {
  const { devices } = useBleScanning();
  //console.log("here", devices);

  const { isConnected, isConnecting, connectToDevice, stopConnecting, currentDevice } = useBleConnection();

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
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20 }}>All Devices: </Text>
      <View style={{ width: "100%", borderBottomColor: "black", borderBottomWidth: 2 }}></View>
      <View style={{ flex: 1 }}>
        <ScanDevicesScreen devices={devices} onClose={onClose} onDevicePress={onDevicePress} isConnecting={isConnecting} currentDevice={currentDevice} />
      </View>
    </View>
  );
};

//

export default ScanDevicesScreenContainer;
