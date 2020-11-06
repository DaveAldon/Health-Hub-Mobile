import { Text, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Container, TitleText, ConnectingText, BorderLine } from "./styled";

const DeviceItem = ({ name, onSelect, isPairing, isLastElem }) => {
  return (
    <TouchableOpacity style={{ backgroundColor: "#ebebeb", padding: 15, borderRadius: 10 }} onPress={onSelect}>
      <Text>{name}</Text>
      {isPairing && <Text>{"pairing..."}</Text>}
      {/* {!isLastElem && <Text>_ _ _ _</Text>} */}
    </TouchableOpacity>
  );
};

//

export default DeviceItem;
