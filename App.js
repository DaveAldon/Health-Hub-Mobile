import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StatusBar,PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import MainContainer from './src/components/MainContainer';
export const bleManager = new BleManager();

const App = () => {
  useEffect(()=>{
    (async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission Localisation Bluetooth',
          message: 'Requirement for Bluetooth',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      const grantedCoarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Permission Localisation Bluetooth',
          message: 'Requirement for Bluetooth',
          buttonNeutral: 'Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
    })()
  },[])
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <MainContainer />
        {/* <View>
          <Text>Learn More</Text>
          <Text>
            Read the docs to discover what to do next:
          </Text>
        </View> */}
      </SafeAreaView>
    </>
  );
};

export default App;
