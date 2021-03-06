import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { IProp } from "../../standards/interfaces";
import { Header } from "../header";
import ECG_Data from "../../hooks/SampleECG";
import LineChartECG from "../Graphs/LineChart";

const data = ECG_Data();
const GraphScreen = (props: IProp) => {
  const navigation = props.navigation;

  const ECGConfigScroll = {
    data: data,
    width: 1000,
    height: 300,
    live: false,
  };
  const ECGConfig = {
    data: data,
    width: Dimensions.get("window").width,
    height: 300,
    live: true,
  };

  return (
    <View style={{ flex: 1 }}>
      <Header {...props} />
      <View style={{ flex: 1, paddingTop: 10 }}>
        <View style={{ height: 300 }}>
          <ScrollView style={{}} horizontal={true}>
            <LineChartECG {...ECGConfigScroll} />
          </ScrollView>
        </View>
        <View style={{ height: 300 }}>
          <LineChartECG {...ECGConfig} />
        </View>
      </View>
    </View>
  );
};

export default GraphScreen;
