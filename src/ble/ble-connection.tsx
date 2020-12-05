import { bleManager } from "../../App";
// @ts-ignore
import base64 from "react-native-base64";
import * as deviceIds from "../standards/deviceIDs";
import { iDevice } from "../standards/interfaces";

let connectedDevice = null;

export default class BleConnection {
  // to prevent leaks (callback when component is unmounted)
  shouldNotifyWhenConnected;

  constructor() {
    this.shouldNotifyWhenConnected = false;
  }

  async connect(device: iDevice) {
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
  _showAllCharacteristics(device: iDevice) {
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
      .writeCharacteristicWithResponseForDevice(connectedDevice?.id, deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_RX_CHARACTERISTIC_UUID, msg, null)
      .then((resp) => {
        console.log(`${connectedDevice.name} Response: ${resp}`);
        //console.log(resp);
      })
      .catch((err) => {
        console.log(`${connectedDevice.name} Error: ${err}`);
      });

    /*     bleManager
      .readCharacteristicForDevice(connectedDevice?.id, UART_SERVICE_UUID, UART_TX_CHARACTERISTIC_UUID, null)
      .then((value) => {
        console.log(value);
      })
      .catch((error) => {
        console.log(error);
      }); */

    /*
    bleManager.monitorCharacteristicForDevice(connectedDevice?.id, deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_TX_CHARACTERISTIC_UUID, (error, characteristic) => {
      if (error) {
        console.log(JSON.stringify(error));
        return;
      }
      console.log(base64.decode(characteristic.value));
    });
    */
  }
}
