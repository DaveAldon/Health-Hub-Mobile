import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, PermissionsAndroid, Platform, View, Text, TouchableOpacity } from "react-native";
import { BleManager, Device, BleError, Subscription, State } from "react-native-ble-plx";
import MainContainer from "./src/components/MainContainer";
import SettingsScreen from "./src/components/Settings";
import LoginScreen from "./src/components/Login";
import { iDevice } from "./src/standards/interfaces";
//import Background from "./src/standards/Background";
import base64 from "react-native-base64";
import * as deviceIds from "./src/standards/deviceIDs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { IProp } from "./src/standards/interfaces";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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

let initialRender = true;
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
      <Drawer.Navigator
        initialRouteName="Home"
        drawerType="slide"
        drawerContent={(props) => {
          // If you don't cancel the initial render, the drawer will flash on the screen
          if (initialRender) {
            initialRender = false;
            return null;
          }
          return (
            <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, flexDirection: "column", justifyContent: "space-between", paddingTop: 50 }}>
              <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start" }}>
                <DrawerItem labelStyle={[{}]} label="Health Hub" onPress={() => props.navigation.navigate("Home")} icon={() => <Feather name="monitor" size={30} color="black" />} />
                <DrawerItem labelStyle={[{}]} label="Settings" onPress={() => props.navigation.navigate("Settings")} icon={() => <FontAwesome name="gear" size={35} color="black" />} />
                <DrawerItem
                  labelStyle={[{}]}
                  label="Logout"
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("Login");
                  }}
                  icon={() => <AntDesign name="logout" size={30} />}
                />
              </View>
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen name="Home">{(props) => <MainContainer {...props} />}</Drawer.Screen>
        <Drawer.Screen name="Settings">{(props) => <SettingsScreen {...props} />}</Drawer.Screen>
      </Drawer.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ height: "100%" }}>
        <Stack.Navigator initialRouteName="HealthHub">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HealthHub" component={DrawerContainer} options={{ headerShown: false }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
