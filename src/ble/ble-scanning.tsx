import { bleManager } from "../../App";
import * as deviceIds from "../standards/deviceIDs";

// import { BleDevice } from '../useBleConnection/useBleConnection';

// TODO: change for dynamic use
// Need to add fn to change device's name
const FIXED_NAME = "BLUNO";

//
// Wrapper for bleManager
//
export default class BleScanning {
  startScanning(onNewDevice) {
    console.log("in blescanning");
    bleManager.startDeviceScan(["0000ec00-0000-1000-8000-00805f9b34fb"], { allowDuplicates: true }, (error, device) => {
      // console.log("test", device)
      if (!device) return;
      if (!!device.name || !!device.localName) {
        onNewDevice({
          name: device.name ? device.name : "",
          id: device.id ? device.id : "",
        });

        // console.log('new DEVICE = ', device);
      }
    });
  }

  stopScanning() {
    bleManager.stopDeviceScan();
  }
}
