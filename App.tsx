import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, PermissionsAndroid } from "react-native";
import { BleManager, Device, BleError, Subscription, State } from "react-native-ble-plx";
import MainContainer from "./src/components/MainContainer";
import { iDevice } from "./src/standards/interfaces";
//import Background from "./src/standards/Background";
import base64 from "react-native-base64";
import * as deviceIds from "./src/standards/deviceIDs";

export const bleManager = new BleManager({
  restoreStateIdentifier: "BleInTheBackground",
  restoreStateFunction: (restoredState) => {
    if (restoredState == null) {
      // BleManager was constructed for the first time.
      console.log("BLE Manager was not restored");
    } else {
      // BleManager was restored. Check `restoredState.connectedPeripherals` property.
      const devices = restoredState.connectedPeripherals;
      if (devices.length === 0) {
        console.log("No connected devices to restore!");
      } else {
        const device = devices[0];
        console.log("Restoring Device...");
        /* restoredProcess(device)
          .then(() => {
            console.log("Restoration completed");
          })
          .catch(() => {
            console.log("Restoration failed");
          }); */
      }
      console.log(`BleManager restored: ${restoredState.connectedPeripherals.map((device) => device.name)}`);
    }
  },
});

const App = () => {
  useEffect(() => {
    (async () => {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Permission Localisation Bluetooth",
        message: "Requirement for Bluetooth",
        buttonNeutral: "Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      });
      const grantedCoarse = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
        title: "Permission Localisation Bluetooth",
        message: "Requirement for Bluetooth",
        buttonNeutral: "Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      });
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ height: "100%" }}>
        <MainContainer />
      </SafeAreaView>
    </>
  );
};

export default App;
