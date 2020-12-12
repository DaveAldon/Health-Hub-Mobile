import React, { useState, useEffect, useCallback } from "react";
import { LineChart } from "react-native-chart-kit";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";

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

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setSeconds(seconds + 1);
        try {
          let tmpECG = ECGData;
          if (data[seconds] === undefined) {
            setSeconds(0);
          } else {
            tmpECG.push(data[seconds]);
          }
          if (tmpECG.length > 30) tmpECG.shift();
        } catch {
          setSeconds(0);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [seconds]);

  return (
    <View>
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

      <LineChart
        data={{
          labels: [""],
          datasets: [
            {
              data: live ? ECGData : data,
              color: () => `rgb(134, 65, 244)`,
            },
          ],
        }}
        width={width}
        //width={Dimensions.get("window").width} // from react-native
        height={height}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 10,
            color: "red",
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
}
