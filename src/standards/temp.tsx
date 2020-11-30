/**
 * Try to catch all pending events.
 * @param device Device to restore.
 */
export const restoredProcess = async (device: Device) => {
  console.log("Restoring process!");
  const taskStartTime = Date.now();
  const taskName = taskStartTime.toString();
  Background.startBackgroundTask(taskName, () => {
    console.log(`Task ${taskName} expired`);
    Background.endBackgroundTask(taskName);
  });
  console.log(`Task ${taskName} started`);
  try {
    console.log("Make sure that device is connected...");
    await connectToDevice(device, 2000);
    console.log("Waiting for pending events...");
    await waitForPendingTicks(device, 10000, (tickValue) => {
      console.log(`Task ${taskName} value=${tickValue}`);
    });
    console.log("Closing all connections...");
    await cancelAllConnections();
  } catch (error) {
    console.log(`Registered an error: ${error.message}`);
  }
  Background.endBackgroundTask(taskName);
  console.log(`Task ${taskName} finished`);
};

/**
 * Cancels all pending connections
 */
export const cancelAllConnections = async () => {
  const connectedDevices = await bleManager.connectedDevices([deviceIds.raspberryPi.UART_SERVICE_UUID]);
  for (let device of connectedDevices) {
    await device.cancelConnection();
  }
};

/**
 * Wait for pending ticks on a device.
 * @param device      Device to monitor ticks.
 * @param tickTimeout Tick timeout after which we assume there are no pending events.
 * @param onTick      Callback invoked every tick.
 */
const waitForPendingTicks = (device: Device, tickTimeout: number, onTick?: (tickValue: number) => void) => {
  return new Promise<void>((resolve, reject) => {
    // Define subscriptions.
    const subscriptions: {
      monitor: Subscription | null;
      timeout: number | null;
    } = { monitor: null, timeout: null };

    // Clear subscriptions.
    const clearSubscriptions = () => {
      if (subscriptions.monitor != null) {
        subscriptions.monitor.remove();
        subscriptions.monitor = null;
      }
      if (subscriptions.timeout != null) {
        Background.clearTimeout(subscriptions.timeout);
        subscriptions.timeout = null;
      }
    };

    // Start tick timeout
    subscriptions.timeout = Background.setTimeout(() => {
      subscriptions.timeout = null;
      clearSubscriptions();
      resolve();
    }, tickTimeout);

    // Monitor characteristuc
    subscriptions.monitor = device.monitorCharacteristicForService(deviceIds.raspberryPi.UART_SERVICE_UUID, deviceIds.raspberryPi.UART_RX_CHARACTERISTIC_UUID, (error, characteristic) => {
      if (error != null) {
        // On error, reject promise.
        subscriptions.monitor = null;
        clearSubscriptions();
        reject(error);
        return;
      }

      if (characteristic != null && characteristic.value != null) {
        // Convert tick
        const bytes = base64.toByteArray(characteristic.value);
        const ticks = new DataView(bytes.buffer).getUint32(0, true);
        if (onTick) {
          onTick(ticks);
        }

        // Restart tick timeout
        if (subscriptions.timeout != null) {
          Background.clearTimeout(subscriptions.timeout);
        }
        subscriptions.timeout = Background.setTimeout(() => {
          subscriptions.timeout = null;
          clearSubscriptions();
          resolve();
        }, tickTimeout);
      }
    });
  });
};

/**
 *
 * @param device         Device to connect.
 * @param timeout        Timeout after which we abort connection.
 * @param onDisconnected Callback emitted when device disconnected.
 */
export const connectToDevice = async (device: Device, timeout: number | undefined, onDisconnected?: (error: BleError | null) => void) => {
  const subscription = device.onDisconnected((error) => {
    console.log("Disconnected!");
    subscription.remove();
    if (onDisconnected) {
      onDisconnected(error);
    }
  });

  if (await device.isConnected()) {
    console.log("Device is already connected");
  } else {
    console.log("Connecting to the device...");
    await device.connect({ timeout });
  }

  console.log("Discovering device...");
  await device.discoverAllServicesAndCharacteristics();

  console.log("Device connected!");
  return device;
};
