import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, PermissionsAndroid, Platform, View, Text } from "react-native";
import { BleManager, Device, BleError, Subscription, State } from "react-native-ble-plx";
import MainContainer from "./src/components/MainContainer";
import LoginScreen from "./src/components/Login";
import { iDevice } from "./src/standards/interfaces";
//import Background from "./src/standards/Background";
import base64 from "react-native-base64";
import * as deviceIds from "./src/standards/deviceIDs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { IProp } from "./src/standards/interfaces";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Entypo } from "react-native-vector-icons";

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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
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
      }
    })();
  }, []);

  function DrawerContainer() {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainContainer} />
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ height: "100%" }}>
        <Stack.Navigator initialRouteName="HealthHub">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HealthHub" component={DrawerContainer} options={{ headerShown: true }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
