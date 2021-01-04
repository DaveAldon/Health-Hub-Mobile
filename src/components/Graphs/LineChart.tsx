import React, { useState, useEffect, useCallback } from "react";
//import { LineChart } from "react-native-chart-kit";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { LineChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
interface IProp {
  data: any;
  width: number;
  height: number;
  live: boolean;
}

export default function LineChartECG(props: IProp) {
  const { data, width, height, live } = props;
  const [ECGData, setECGData] = useState([0]);
  const [seconds, setSeconds] = useState(0);
  const StaticData = [].concat.apply([], data);

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setSeconds(seconds + 1);
        try {
          let tmpECG = ECGData;
          if (data[seconds] === undefined) {
            setSeconds(0);
          } else {
            tmpECG.push(parseInt(data[seconds]));
          }
          if (tmpECG.length > 30) tmpECG.shift();
        } catch {
          setSeconds(0);
        }
      }, 200);
      return () => {
        clearInterval(interval);
      };
    }
  }, [seconds]);

  const contentInset = { top: 20, bottom: 20 };

  return (
    <View style={{ height: "100%", flexDirection: "column", paddingHorizontal: 10, backgroundColor: "white", borderRadius: 10 }}>
      {live && (
        <TouchableOpacity
          style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb", margin: 5 }}
          onPress={() => {
            setSeconds(0);
            setECGData([0]);
          }}
        >
          <Text>Reset - Interval {seconds}</Text>
        </TouchableOpacity>
      )}
      <View style={{ flexDirection: "row", height: "90%" }}>
        <YAxis
          style={{ height: "100%", width: 30 }}
          contentInset={contentInset}
          data={live ? ECGData : StaticData}
          svg={{
            fill: "grey",
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value}`}
        />
        <LineChart style={{ height: "100%", width: width }} data={live ? ECGData : StaticData} svg={{ stroke: "rgb(134, 65, 244)" }} contentInset={contentInset}>
          <Grid />
        </LineChart>
      </View>
      <XAxis
        style={{ height: "10%", width: "100%" }}
        data={live ? ECGData : StaticData}
        formatLabel={(label, index) => `${getFormatedLabel(label, index)}`}
        contentInset={{ left: 33 }}
        svg={{ fontSize: 10, fill: "black" }}
      />
    </View>
  );
}

function getFormatedLabel(label, index) {
  if (index % 5 === 0) {
    return `${label}s`; //moment(label).format('HH [h]');
  } else {
    return "";
  }
}
