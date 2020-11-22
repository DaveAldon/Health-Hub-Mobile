import { Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { iDevice } from "../../standards/interfaces";

const DeviceItem = ({ device, onSelect, isPairing, isLastElem }: {device: iDevice, onSelect: any, isPairing: boolean, isLastElem: boolean}) => {
  return (
    <TouchableOpacity style={{ backgroundColor: "#ebebeb", padding: 10, borderRadius: 10 }} onPress={onSelect}>
      <Text>{device.name}</Text>
      <Text style={{fontSize:10}}>{device.id}</Text>
      {isPairing && <Text>{"pairing..."}</Text>}
    </TouchableOpacity>
  );
};

export default DeviceItem;
