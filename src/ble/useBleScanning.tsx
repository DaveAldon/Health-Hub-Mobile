import { useEffect, useState, useCallback, useRef } from "react";
import BleScanning from "./ble-scanning";
import { iDevice } from "../standards/interfaces";

const useBleScanning = () => {
  let bleScanning = useRef(new BleScanning());

  const [devices, setDevices] = useState([]);

  const addNewDevice = useCallback(
    (device: iDevice) => {
      if (!devices.find((d) => d.id === device.id)) {
        setDevices([...devices, device]);
        console.log("ADD DEVICE = ", device);
      }
    },
    [devices],
  );

  const startScanning = useCallback(() => {
    console.log("scanning now");
    bleScanning.current.startScanning((device) => {
      addNewDevice({
        name: device.name ?? "",
        id: device.id ?? "",
      });
    });
  }, [addNewDevice]);

  function stopScanning() {
    bleScanning.current.stopScanning();
  }

  function refresh() {
    setDevices([]);
    bleScanning.current.stopScanning();
    bleScanning.current.startScanning();
  }

  return {
    startScanning,
    stopScanning,
    devices,
    refresh,
  };
};

export default useBleScanning;
