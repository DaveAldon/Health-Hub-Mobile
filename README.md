# Health Hub Mobile

## Setup

- Install the react-native cli `npm install –g react-native-cli`
- `git clone https://github.com/DaveAldon/Health-Hub-Mobile.git`
- `npm install`

##### Bluetooth plugin requires extra fiddling

- ##### iOS

  1. `npm install --save react-native-ble-plx`
  2. `npx react-native link react-native-ble-plx`
  3. Open Xcode workspace located inside `ios` folder and add empty Swift file if you don't have at least one:

  - Select File/New/File...
  - Choose Swift file and click Next.
  - Name it however you want, select your application target and create it.
  - Accept to create Objective-C bridging header.

  4. Update your `ios/Podfile` to contain (it may be already there):

  ```
  pod 'react-native-ble-plx', :path => '../node_modules/react-native-ble-plx'
  ```

  5. Enter `ios` folder and run `pod update`
  6. Add `NSBluetoothAlwaysUsageDescription` in `info.plist` file. (it is a requirement since iOS 13)
  7. Add support for background mode:
     - In your application target go to `Capabilities` tab and enable `Uses Bluetooth LE Accessories` in `Background Modes` section
     - Pass `restoreStateIdentifier` and `restoreStateFunction` to `BleManager` constructor

- ##### Android

  1. `npm install --save react-native-ble-plx`
  2. `npx react-native link react-native-ble-plx`
  3. In top level `build.gradle` make sure that min SDK version is at least 18:

  ```groovy
  buildscript {
      ext {
          ...
          minSdkVersion = 18
          ...
  ```

  4. In `build.gradle` make sure to add jitpack repository to known repositories:

  ```groovy
  allprojects {
      repositories {
      ...
      maven { url 'https://www.jitpack.io' }
      }
  }
  ```

  5. In `AndroidManifest.xml`, add Bluetooth permissions and update `<uses-sdk/>`:

  ```xml
  <manifest xmlns:android="http://schemas.android.com/apk/res/android"
      ...
      <uses-permission android:name="android.permission.BLUETOOTH"/>
      <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
      <uses-permission-sdk-23 android:name="android.permission.ACCESS_FINE_LOCATION"/>

      <!-- Add this line if your application always requires BLE. More info can be found on:
          https://developer.android.com/guide/topics/connectivity/bluetooth-le.html#permissions
      -->
      <uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>

      ...
  ```

## Run

Note that you need to run on a physical device or else the bluetooth functionality won't work.

- iOS `react-native run-ios --device`

- Android `react-native run-android`

## Troubleshooting

#### Android

- ##### Build error

  The error may look something like this, or a general failure to install because of "missing sdk" even though it's installed!

  ```
  FAILURE: Build failed with an exception.

  * Where:
  Build file 'PATH/Health Hub/node_modules/react-native-reanimated/android/build.gradle' line: 89
  ```

  Open the Android folder in Android Studio and wait until the automatic gradle processes finish. Then build normally.

#### iOS

- ##### Pod Install error (Flipper-Glog 0.3.6)
  ```
  xcrun: error: SDK "iphoneos" cannot be located
  xcrun: error: unable to lookup item 'Path' in SDK 'iphoneos'
  configure: error: C compiler cannot create executables
  ```
  Solution:
  ```
  sudo xcode-select --switch /Applications/Xcode.app
  pod install
  ```
- ##### The following build commands failed: CpResource
  Solution:
  ```
  react-native bundle --entry-file index.tsx --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
  react-native run-ios --device
  ```
- ##### run-ios "ios-deploy" permissions error
  Solution:
  ```
  npm install ios-deploy -g
  ```
  If the above fails due to a permission error, run:
  ```
  sudo npm install --global --unsafe-perm ios-deploy
  ```
- ##### MultiplatformBleAdapter wrong version or related error
  Solution:
  ```
  cd ios
  pod update MultiplatformBleAdapter
  ```
