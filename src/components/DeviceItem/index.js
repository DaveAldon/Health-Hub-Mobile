import { Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  TitleText,
  ConnectingText,
  BorderLine
} from './styled';

const DeviceItem = ({ name, onSelect, isPairing, isLastElem }) => {
  return (
    <Container onPress={onSelect}>
      <Text>{name}</Text>
      {isPairing && <ConnectingText>{'pairing...'}</ConnectingText>}
      {!isLastElem && <BorderLine />}
    </Container>
  );
};

//

export default DeviceItem;
