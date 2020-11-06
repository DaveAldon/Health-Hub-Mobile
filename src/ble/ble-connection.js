import { bleManager } from "../../App";
import { HSVtoRGB, rawHSVtoRGB } from "../theme/colors";
// @ts-ignore
import base64 from "react-native-base64";

let connectedDevice = null;

// Device's Serial Port service and write charasteristic
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const SerialCharacteristicUUID = "0000dfb1-0000-1000-8000-00805f9b34fb";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
//
// Ugly(!!!!) wrapper for bleManager
//
export default class BleConnection {
  // to prevent leaks (callback when component is unmounted)
  shouldNotifyWhenConnected;
  //

  constructor() {
    this.shouldNotifyWhenConnected = false;
  }

  async connect(device) {
    connectedDevice = device;

    this.shouldNotifyWhenConnected = true;

    try {
      await bleManager.connectToDevice(device.id);

      await bleManager.discoverAllServicesAndCharacteristicsForDevice(device.id);

      // optional
      this._showAllCharacteristics(device);
    } catch (err) {
      if (this.shouldNotifyWhenConnected) {
        throw "Could not connect!";
      }
    }
  }

  // optional to see all services and characteristics
  _showAllCharacteristics(device) {
    bleManager.servicesForDevice(device.id).then((services) => {
      console.log("SERVICES = ", services);

      services.forEach((s) => {
        bleManager.characteristicsForDevice(device.id, s.uuid).then((char) => {
          console.log("CHARS = ", char);
        });
      });
    });
  }

  stopConnecting() {
    this.shouldNotifyWhenConnected = false;
  }

  disconnect() {
    if (connectedDevice) {
      this.shouldNotifyWhenConnected = false;

      console.log("CANCEL cancelDeviceConnection !!!");
      bleManager.cancelDeviceConnection(connectedDevice.id);
    }
  }

  onDisconnected(callback) {
    if (!connectedDevice) {
      return;
    }

    bleManager.onDeviceDisconnected(connectedDevice.id, (error, device) => {
      console.log("DISCONNECTED!!", error);

      if (this.shouldNotifyWhenConnected) {
        callback();
      }
    });
  }

  sendMessage(message) {
    if (!connectedDevice) {
      return;
    }
    const msg = base64.encode(message);

    bleManager
      .writeCharacteristicWithResponseForDevice(connectedDevice?.id, UART_SERVICE_UUID, UART_TX_CHARACTERISTIC_UUID, msg, null)
      .then((resp) => {
        console.log(`${connectedDevice.name} Response: ${resp}`);
      })
      .catch((err) => {
        console.log(`${connectedDevice.name} Error: ${err}`);
      });
  }
}
