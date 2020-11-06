import React, {useState} from 'react';
import {View, Text} from 'react-native';

import useBleDevices from '../../ble/useBleDevices';
import ScanDevicesScreenContainer from "../ScanScreen";

const MainContainer = () => {
  const {
    devices,
    currentDevice,
    isConnected,
    isConnecting,
    connectToDevice,
    onNewDevicePaired,
    removeDevice,
    sendColorToCurrentDevice
  } = useBleDevices();

  const [isScanning, setIsScanning] = useState(true);
  const onNewDeviceConnected = (device) => {
    setIsScanning(false);

    onNewDevicePaired(device);
  };

  const onScanPress = () => {
    setIsScanning(true);
  }

  const onDeviceSelect= (device) => {
    connectToDevice(device);
  }
  const onColorSelect = (color) => {
    sendColorToCurrentDevice(color);
  }

  return (
      <View style={{flex: 1}}>
    {isScanning && (
              <ScanDevicesScreenContainer
                onClose={() => setIsScanning(false)}
                onDeviceConnected={onNewDeviceConnected}
              />
            )}
    </View>
  );
};

export default MainContainer;
