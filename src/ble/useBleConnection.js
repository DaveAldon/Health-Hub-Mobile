import { useEffect, useState, useCallback, useRef } from "react";
import BleConnection from "./ble-connection";

export default function useBleConnection() {
  const bleConnection = useRef(new BleConnection());

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [currentDevice, setCurrentDevice] = useState(null);

  function connectToDevice(device) {
    disconnect();

    setIsConnecting(true);

    setCurrentDevice(device);

    console.log("CONNECT TO DEVICE = ", device.name);

    bleConnection.current
      .connect(device)
      .then(() => {
        console.log("Connection established!");

        setIsConnected(true);
      })
      .catch((err) => {
        console.log("Connection error = ", err);

        setIsConnected(false);

        setCurrentDevice(null);
      })
      .finally(() => {
        setIsConnecting(false);
      });

    listenToDisconnect();
  }

  function listenToDisconnect() {
    bleConnection.current.onDisconnected(() => {
      // TODO: fix at start
      // setIsConnected(false);
    });
  }

  function disconnect() {
    if (isConnected) {
      console.log("BLE disconnect");
      bleConnection.current.disconnect();
      setIsConnected(false);
      setCurrentDevice(null);
    }
  }

  function onNewPairedDevice(device) {
    setIsConnected(true);
    setCurrentDevice(device);
  }

  // this should be moved to separate module
  // (as it is not about making a connection)
  function sendMessage(message) {
    console.log(`Sending message: ${message}`);
    bleConnection.current.sendMessage(message);
  }

  function stopConnecting() {
    bleConnection.current.stopConnecting();
  }

  return {
    connectToDevice,
    stopConnecting,
    disconnect,
    isConnecting,
    isConnected,
    currentDevice,
    onNewPairedDevice,
    sendMessage,
  };
}
