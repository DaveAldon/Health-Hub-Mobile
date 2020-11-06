import React, { useEffect, useRef, useCallback } from "react";
import useBleConnection from "./useBleConnection";
import useBleStorage from "./useBleStorage";
import useAppState from "../hooks/useAppState";

export default function useBleDevices() {
  const ble = useBleConnection();

  const bleStorage = useBleStorage();

  const onBackground = useCallback(() => ble.disconnect(), [ble]);
  const onForeground = useCallback(() => {
    if (!ble.isConnected && !ble.isConnecting && bleStorage.currentDevice) {
      ble.connectToDevice(bleStorage.currentDevice);
    }
  }, [ble, bleStorage.currentDevice]);

  useAppState({ onBackground, onForeground });

  // auto-connect at start
  const didAutoConnect = useRef(false);

  useEffect(() => {
    if (bleStorage.currentDevice && !ble.isConnected && !ble.isConnecting) {
      if (!didAutoConnect.current) {
        ble.connectToDevice(bleStorage.currentDevice);
        didAutoConnect.current = true;
      }
    }
  }, [bleStorage.currentDevice, ble]);

  // connect to saved device
  function connectToDevice(device) {
    bleStorage.setCurrentDevice(device);

    ble.connectToDevice(device);
  }

  // we connected to a new scanned device
  function onNewDevicePaired(device) {
    bleStorage.setCurrentDevice(device);
    bleStorage.addDevice(device);

    ble.onNewPairedDevice(device);
  }

  function removeDevice(device) {
    if (bleStorage.currentDevice && device.id === bleStorage.currentDevice.id) {
      ble.disconnect();
      bleStorage.setCurrentDevice(null);
    }

    bleStorage.removeDevice(device);
  }

  function sendMessageToCurrentDevice(message) {
    ble.sendMessage(message);
  }

  return {
    connectToDevice,
    removeDevice,
    onNewDevicePaired,
    sendMessageToCurrentDevice,
    devices: bleStorage.devices,
    currentDevice: bleStorage.currentDevice,
    isConnected: ble.isConnected,
    isConnecting: ble.isConnecting,
  };
}
