import React, { useEffect, useCallback, useState } from "react";
import useBleScanning from "../../ble/useBleScanning";
import useBleConnection from "../../ble/useBleConnection";
import ScanDevicesScreen from "./Screen";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { iDevice } from "../../standards/interfaces";
import * as Keychain from "react-native-keychain";

const ScanDevicesScreenContainer = ({ onDeviceConnected, onClose }) => {
  const { devices, startScanning, stopScanning, refresh } = useBleScanning();
  const [allowScan, setAllowScan] = useState(false);
  //console.log("here", devices);

  const [textValue, setTextValue] = useState("");

  const { isConnected, isConnecting, connectToDevice, stopConnecting, currentDevice } = useBleConnection();

  useEffect(() => {
    (async () => {
      const uuids = await Keychain.getInternetCredentials("uuids");
      setTextValue(uuids.password);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (allowScan) {
        await Keychain.setInternetCredentials("uuids", "uuids", textValue || "empty");
        startScanning();
      }
      return () => {
        stopScanning();
      };
    })();
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

  useEffect(() => {
    if (devices.length && textValue !== "empty") {
      setAllowScan(false);
    }
  }, [devices]);

  function scan() {
    refresh();
    setAllowScan(true);
  }

  return (
    <View style={{ flex: 1, padding: 10, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{ width: "100%", height: 40, borderColor: "gray", borderWidth: 1, padding: 5, borderRadius: 10, textAlign: "center", marginBottom: 20, backgroundColor: "white" }}
        onChangeText={(text) => setTextValue(text)}
        value={textValue === "empty" ? "" : textValue}
        placeholder={"Service UUID"}
        placeholderTextColor={"gray"}
      />
      <TouchableOpacity
        style={{ backgroundColor: "green", width: "100%", height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          scan();
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
