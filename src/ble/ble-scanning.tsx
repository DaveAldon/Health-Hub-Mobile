import { bleManager } from "../../App";
import * as Keychain from "react-native-keychain";

// Wrapper for bleManager
export default class BleScanning {
  async startScanning(onNewDevice) {
    const uuids = await Keychain.getInternetCredentials("uuids");
    let filter = uuids.password === "empty" ? null : [uuids.password];
    bleManager.startDeviceScan(filter, { allowDuplicates: true }, (error, device) => {
      if (!device) return;
      if (!!device.name || !!device.localName) {
        onNewDevice({
          name: device.name ? device.name : "",
          id: device.id ? device.id : "",
        });
      }
    });
  }

  stopScanning() {
    bleManager.stopDeviceScan();
  }
}
