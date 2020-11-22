import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import useBleDevices from "../../ble/useBleDevices";
import ScanDevicesScreenContainer from "../ScanScreen";
import { iDevice } from "../../standards/interfaces";
import { bleManager } from "../../../App";
import * as deviceIds from "../../standards/deviceIDs";
import base64 from "react-native-base64";

enum messageType {
  "FromBLEDevice",
  "FromPhone",
}

interface iMessage {
  message: string;
  from: string;
}

const MainContainer = () => {
  const { devices, currentDevice, isConnected, isConnecting, connectToDevice, onNewDevicePaired, removeDevice, sendMessageToCurrentDevice } = useBleDevices();
  const [isScanning, setIsScanning] = useState(true);
  const [messages, setMessages] = useState([]);

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const onNewDeviceConnected = (device: iDevice) => {
    setIsScanning(false);

    onNewDevicePaired(device);

    // subscription to the read characteristic
    bleManager.monitorCharacteristicForDevice(currentDevice?.id, deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_TX_CHARACTERISTIC_UUID, (error, characteristic) => {
      if (error) {
        console.log(JSON.stringify(error));
        return;
      }
      let message = base64.decode(characteristic.value);
      updateMessages(message, messageType.FromBLEDevice);
    });
  };

  function updateMessages(message: String, messageType: messageType) {
    let tmpMsg = messages;
    tmpMsg.push({
      message: message,
      from: messageType,
    });
    setMessages(tmpMsg);
    forceUpdate();
  }

  const onScanPress = () => {
    setIsScanning(true);
  };

  const onDeviceSelect = (device: iDevice) => {
    connectToDevice(device);
  };
  const onMessageSend = (message: String) => {
    sendMessageToCurrentDevice(message);
    updateMessages(message, messageType.FromPhone);
  };

  const [value, onChangeText] = useState("Useless Placeholder");

  return (
    <View style={{ flex: 1 }}>
      {isScanning && <ScanDevicesScreenContainer onClose={() => setIsScanning(false)} onDeviceConnected={onNewDeviceConnected} />}
      {isConnected && !isScanning && (
        <View>
          <Text style={{ fontSize: 20 }}>Connected to: {currentDevice.name}</Text>
          <TouchableOpacity
            style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb" }}
            onPress={() => {
              onMessageSend(value);
            }}
          >
            <Text>Send data</Text>
          </TouchableOpacity>
          <View>
            <TextInput style={{ height: 40, borderColor: "gray", borderWidth: 1 }} onChangeText={(text) => onChangeText(text)} value={value} />
          </View>
          <View style={{ alignItems: "center" }}>
            {messages &&
              messages.map((value: iMessage, index: number) => (
                <View style={{ backgroundColor: value.from ? "#ebebeb" : "#4293f5", borderRadius: 10, width: "90%", padding: 10, justifyContent: "center", margin: 5 }}>
                  <Text style={{ color: value.from ? "black" : "white" }} key={index}>
                    {value.message}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default MainContainer;
