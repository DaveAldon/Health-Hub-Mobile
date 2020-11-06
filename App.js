import React from 'react';
import { SafeAreaView, View, Text, StatusBar } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import MainContainer from './src/components/MainContainer';
export const bleManager = new BleManager();

const App = () => {
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
