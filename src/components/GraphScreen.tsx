import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { IProp } from "../standards/interfaces";
import { Header } from "../components/header";
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import ECG_Data from "../hooks/SampleECG";

const GraphScreen = (props: IProp) => {
  const navigation = props.navigation;

  const data = ECG_Data();

  return (
    <View style={{ flex: 1 }}>
      <Header {...props} />
      <TouchableOpacity
        style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb", margin: 5 }}
        onPress={() => {
          //navigation.navigate("HealthHub");
        }}
      >
        <Text>Graph!</Text>
      </TouchableOpacity>
      <LineChart
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "0",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default GraphScreen;
