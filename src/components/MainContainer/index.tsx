import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import useBleDevices from "../../ble/useBleDevices";
import ScanDevicesScreenContainer from "../ScanScreen";

const MainContainer = () => {
  const { devices, currentDevice, isConnected, isConnecting, connectToDevice, onNewDevicePaired, removeDevice, sendMessageToCurrentDevice } = useBleDevices();

  const [isScanning, setIsScanning] = useState(true);
  const onNewDeviceConnected = (device) => {
    setIsScanning(false);

    onNewDevicePaired(device);
  };

  const onScanPress = () => {
    setIsScanning(true);
  };

  const onDeviceSelect = (device) => {
    connectToDevice(device);
  };
  const onMessageSend = (message: String) => {
    sendMessageToCurrentDevice(message);
  };

  return (
    <View style={{ flex: 1 }}>
      {isScanning && <ScanDevicesScreenContainer onClose={() => setIsScanning(false)} onDeviceConnected={onNewDeviceConnected} />}
      {isConnected && !isScanning && (
        <View>
          <Text style={{ fontSize: 20 }}>Connected to: {currentDevice.name}</Text>
          <TouchableOpacity
            style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb" }}
            onPress={() => {
              onMessageSend("something");
            }}
          >
            <Text>Send data</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MainContainer;
