import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import ScanDevicesScreenContainer from "../ScanScreen";
import { iDevice, IProp } from "../../standards/interfaces";
import { bleManager } from "../../../App";
import * as deviceIds from "../../standards/deviceIDs";
import base64 from "react-native-base64";
import { Header } from "../header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useBleConnectionContext, ActionsEnum } from "../../ble/bleConnectionContext";

enum messageType {
  "FromBLEDevice",
  "FromPhone",
}

interface iMessage {
  message: string;
  from: string;
  time: string;
}

function getBatteryIcon(level: number) {
  switch (true) {
    case level >= 90:
      return <FontAwesome name="battery" size={24} color="black" />;
    case level >= 75:
      return <FontAwesome name="battery-3" size={24} color="black" />;
    case level >= 50:
      return <FontAwesome name="battery-2" size={24} color="black" />;
    case level >= 15:
      return <FontAwesome name="battery-1" size={24} color="black" />;
    case level >= 0:
      return <FontAwesome name="battery-0" size={24} color="black" />;
  }
}

const MainContainer = (props: IProp) => {
  const [isScanning, setIsScanning] = useState(true);
  const [messages, setMessages] = useState([]);
  const [battery, setBattery] = useState(0);
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  const [value, onChangeText] = useState("");
  const { state, dispatch } = useBleConnectionContext();

  const onNewDeviceConnected = (device: iDevice) => {
    dispatch({ type: ActionsEnum.ON_NEW_PAIRED_DEVICE, payload: device });
    // subscription to the read characteristic
    bleManager.monitorCharacteristicForDevice(device.id, deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_TX_CHARACTERISTIC_UUID, (error, characteristic) => {
      if (error) {
        console.log(JSON.stringify(error));
        return;
      }
      let message = base64.decode(characteristic.value);

      updateMessages(message, messageType.FromBLEDevice);
      console.log(`Device Says: ${message}`);
    });

    bleManager.monitorCharacteristicForDevice(device.id, deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_BATTERY_CHARACTERISTIC_UUID, (error, characteristic) => {
      if (error) {
        console.log(JSON.stringify(error));
        return;
      }
      let message = base64.decode(characteristic.value);
      setBattery(message);
    });
    setIsScanning(false);
  };

  function updateMessages(message: String, messageType: messageType) {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) minutes = `0${minutes}`;
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

  const onMessageSend = (message: String) => {
    dispatch({ type: ActionsEnum.SEND_MESSAGE, payload: message });
    updateMessages(message, messageType.FromPhone);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header {...props} />
      {isScanning && <ScanDevicesScreenContainer onClose={() => setIsScanning(false)} onDeviceConnected={onNewDeviceConnected} />}
      {state.isConnected && !isScanning && (
        <View style={{ padding: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>Connected to: {state.currentDevice.name}</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: 70 }}>
              <Text style={{ marginRight: 5 }}>{getBatteryIcon(battery)}</Text>
              <Text>{battery}%</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ padding: 15, borderRadius: 10, backgroundColor: "#eb5757", margin: 5 }}
            onPress={() => {
              setIsScanning(true);
              dispatch({ type: ActionsEnum.REMOVE_DEVICE, payload: state.currentDevice });
              dispatch({ type: ActionsEnum.DISCONNECT });
            }}
          >
            <Text style={{ color: "white" }}>Disconnect</Text>
          </TouchableOpacity>
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
