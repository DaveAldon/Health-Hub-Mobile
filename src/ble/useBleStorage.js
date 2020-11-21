import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const DEVICES_KEY = 'DEVICES_KEY';
const CURRENT_DEVICE_KEY = 'CURRENT_DEVICE_KEY';

export default function useBleStorage() {
  const [devices, setDevices] = useState([]);

  const [currentDevice, setCurrentDevice] = useState(null);

  const updateStorage = useCallback(() => {
    AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
    AsyncStorage.setItem(CURRENT_DEVICE_KEY, JSON.stringify(currentDevice));
  }, [devices, currentDevice]);

  useEffect(() => {
    fetchStorage();
  }, []);

  // update storage on every devices change
  useEffect(() => {
    updateStorage();
  }, [devices, currentDevice, updateStorage]);

  function fetchStorage() {
    // TODO: merge into promise all
    AsyncStorage.getItem(DEVICES_KEY).then((val) => {
      if (val) {
        const devs = JSON.parse(val);
        setDevices(devs);
      }
    });

    AsyncStorage.getItem(CURRENT_DEVICE_KEY).then((val) => {
      if (val) {
        const dev = JSON.parse(val);
        setCurrentDevice(dev);
      }
    });
  }

  function addDevice(device) {
    const isNewDevice = devices.findIndex((d) => d.id === device.id) === -1;

    if (isNewDevice) {
      setDevices([...devices, device]);
    }
  }

  function removeDevice(device) {
    const filteredDevices = devices.filter((d) => d.id !== device.id);

    setDevices(filteredDevices);
  }

  return {
    devices,
    addDevice,
    removeDevice,
    fetchStorage,
    currentDevice,
    setCurrentDevice
  };
}
