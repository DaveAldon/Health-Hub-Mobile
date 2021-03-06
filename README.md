# Health Hub Mobile

## Setup

- Install the react-native cli `npm install –g react-native-cli`
- `git clone https://github.com/DaveAldon/Health-Hub-Mobile.git`
- `npm install`

## Run

Note that you need to run on a physical device or else the bluetooth functionality won't work.

- iOS `react-native run-ios --device`
- Android `react-native run-android`
- Specific iOS simulator `npx react-native run-ios --simulator="iPhone 12 Pro Max"`

### Build for Release or Detox

- iOS `react-native run-ios --configuration=release`
- Android `cd android && ./gradlew assembleRelease -x bundleReleaseJsAndAssets`

### Detox Troubleshooting

- ##### ChildProcessError: Command failed: applesimutils --list --byType "iPhone 12 Pro Max"
  1. `brew tap wix/brew`
  2. `brew install applesimutils`

### Build Troubleshooting

- #### Android
  - ##### Execution failed for task ':app:bundleReleaseJsAndAssets'
    Solution: `react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
    Then build: `cd android && ./gradlew assembleRelease -x bundleReleaseJsAndAssets`

### Library Setup (BLE requires extra fiddling)

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

## General Troubleshooting

##### My builds are old versions, not the latest!

- ##### Android
  1. Delete files inside directory android/app/src/main/assets
  2. `react-native bundle --platform android --dev false --entry-file index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`
  3. `react-native run-android`
- ##### iOS
  1. `react-native bundle --entry-file index.tsx --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios/assets`
  2. `react-native run-ios --device`

#### Android

- ##### adb version mismatch

  If you run an adb command, and it restarts and outputs a version mismatch like so:
  `adb server version (32) doesn't match this client (41); killing...`
  This is likely due to your environment variables not being setup correctly. Many solutions online point us to just stopping/starting adb server, but that may not suffice. If you're using a mac with zsh, run the following:
  
  `nano ~./zshrc`
  
  Add this to the file:
  
  ```
  alias adb='/Users/USERNAME/Library/Android/sdk/platform-tools/adb'
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```
  
  Save, and restart terminal instances, or use `source ~/.zshrc`

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
  If you run the above command, even with sudo, and get a permissions issue that includes something like this:
  ```
  watchmanResponse: {
    error: 'resolve_projpath: path `PATH/Health Hub`: open: PATH/Health Hub: Operation not permitted',
    version: '4.9.0'
  }
  ```
  Give watchmen full disk access in System Preferences (System Preferences -> Security & Privacy -> Privacy -> Full Disk Access)
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
- ##### 'Multiple commands produce X' error when building in XCode
  Solution:
  ```
  Select app target in XCode -> Build Phases -> Remove all font files installed via React-Native-Vector-Icons package linking, and then rebuild
  ```
- ##### 'Could not connect to development server' when running in simulator

  Solution:

  ```
  sudo lsof -i :8081
  kill -9 <PROCESS_ID>
  ```

  These are conflicting with the default 8081 ports. You can also run RN on a different port if you wish via:

  ```
  react-native start --port=8088
  ```

- ##### Building for iOS Simulator, but linking in object file built for iOS, for architecture arm64
  Solution: You have to exclude arm64 for simulator architecture both from your project and the Pod project
  - Navigate to Build Settings of your project and add `Any iOS Simulator SDK` with value `arm64` inside `Excluded Architecture`
    ![arm64](documentation/arm64.png)
  - Do the same for the Pod project
  - Add the following to your pod file so that the settings aren't overwritten the next time you run `pod install`:
  ```
  post_install do |installer|
    installer.pods_project.build_configurations.each do |config|
      config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
    end
  end
  ```
