import React, { useEffect, useState, useMemo, useRef, useContext, createContext, useReducer } from "react";
import BleConnection from "./ble-connection";

interface IState {
  isConnected: boolean;
  isConnecting: boolean;
  currentDevice: {
    id: string;
    name: string;
  };
}

interface IContextProps {
  state: IState;
  dispatch: ({ type, payload, propName }: { type: string; payload?: any; propName?: string }) => void;
}

enum ActionsEnum {
  CHANGE_CONNECTION_STATE = "changeConnectionState",
  CONNECT_TO_DEVICE = "connectToDevice",
  SET_CURRENT_DEVICE = "setCurrentDevice",
  STOP_CONNECTING = "stopConnecting",
  SEND_MESSAGE = "sendMessage",
  ON_NEW_PAIRED_DEVICE = "onNewPairedDevice",
  DISCONNECT = "disconnect",
  REMOVE_DEVICE = "removeDevice",
}

const bleConnection = new BleConnection();

const BleConnectionContext = createContext({} as IContextProps);

const bleConnectionReducer = (state: IState, action: any) => {
  switch (action.type) {
    case ActionsEnum.REMOVE_DEVICE:
      if (state.currentDevice && action.payload.id === state.currentDevice.id) {
        bleConnection.disconnect();
        //bleStorage.setCurrentDevice(null);
      }
      // TODO: incorporate bleStorage into react context
      //bleStorage.removeDevice(device);
      return {
        ...state,
        isConnected: true,
        currentDevice: action.payload,
      };
    case ActionsEnum.ON_NEW_PAIRED_DEVICE:
      return {
        ...state,
        isConnected: true,
        currentDevice: action.payload,
      };
    case ActionsEnum.SEND_MESSAGE:
      console.log(`Sending message: ${action.payload}`);
      bleConnection.sendMessage(action.payload);
      return {
        ...state,
      };
    case ActionsEnum.CHANGE_CONNECTION_STATE:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ActionsEnum.CONNECT_TO_DEVICE:
      bleConnection.disconnect();
      bleConnection
        .connect(action.payload)
        .then(() => {
          console.log("Connection established!");
          bleConnection.onDisconnected(() => {
            console.log("Disconnect listener activated");
            // TODO: fix at start
            // setIsConnected(false);
          });
          return {
            ...state,
            isConnected: true,
            currentDevice: action.payload,
          };
        })
        .catch((err) => {
          console.log("Connection error = ", err);
          return {
            ...state,
            isConnected: false,
            currentDevice: null,
          };
        });
      return {
        ...state,
        isConnected: true,
        currentDevice: action.payload,
      };
    case ActionsEnum.SET_CURRENT_DEVICE:
      return {
        ...state,
        isConnected: true,
        currentDevice: action.payload,
      };
    case ActionsEnum.DISCONNECT:
      bleConnection.disconnect();
      return {
        ...state,
        isConnected: false,
        currentDevice: null,
      };
    case ActionsEnum.STOP_CONNECTING:
      bleConnection.stopConnecting();
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
};

const initialState: IState = {
  isConnected: false,
  isConnecting: false,
  currentDevice: { id: "", name: "" },
};

function useBleConnectionContext() {
  return useContext(BleConnectionContext);
}

function BleConnectionProvider(props: any) {
  const [state, dispatch] = useReducer(bleConnectionReducer, initialState);

  const bleConnectionContextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <BleConnectionContext.Provider value={bleConnectionContextValue} {...props} />;
}

export { BleConnectionProvider, useBleConnectionContext, ActionsEnum };
