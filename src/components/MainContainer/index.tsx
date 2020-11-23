import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
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
  time: string;
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
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let timeStamp = `${hours}:${minutes}`;
    let tmpMsg = messages;

    tmpMsg.push({
      message: message,
      from: messageType,
      time: timeStamp,
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

  const [value, onChangeText] = useState("");

  return (
    <View style={{ flex: 1 }}>
      {isScanning && <ScanDevicesScreenContainer onClose={() => setIsScanning(false)} onDeviceConnected={onNewDeviceConnected} />}
      {isConnected && !isScanning && (
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20 }}>Connected to: {currentDevice.name}</Text>
          <TouchableOpacity
            style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb", margin: 5 }}
            onPress={() => {
              onMessageSend(value);
            }}
          >
            <Text>Send data</Text>
          </TouchableOpacity>
          <View style={{ margin: 5 }}>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1, padding: 5, borderRadius: 10 }}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              placeholder={"Message to send"}
              placeholderTextColor={"gray"}
            />
          </View>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
            {messages &&
              messages
                .slice(0)
                .reverse()
                .map((value: iMessage, index: number) => (
                  <View
                    style={{ flexDirection: "row", backgroundColor: value.from ? "#ebebeb" : "#4293f5", borderRadius: 10, width: "90%", padding: 10, justifyContent: "space-between", margin: 5 }}
                    key={index}
                  >
                    <Text style={{ color: value.from ? "black" : "white" }}>{value.message.replace(/^\s+|\s+$/g, "")}</Text>
                    <Text style={{ color: value.from ? "black" : "white" }}>{value.time}</Text>
                  </View>
                ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MainContainer;
