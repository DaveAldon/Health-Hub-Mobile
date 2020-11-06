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
      <TitleText>{name}</TitleText>
      {isPairing && <ConnectingText>{'pairing...'}</ConnectingText>}
      {!isLastElem && <BorderLine />}
    </Container>
  );
};

//

export default DeviceItem;
