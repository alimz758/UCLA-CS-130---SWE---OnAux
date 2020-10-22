# OnAux Front-end

App to create sessions for playing music and requesting songs.

# Local Environment Setup

1. [Mac Installation/Setup](#Mac Installation/Setup)
2. [Windows Installation/Setup](#Windows Installation/Setup)
3. [Linux Installation/Setup](#Linux Installation/Setup)

---

## Mac Installation/Setup

1. Install node and watchman:

`brew install node`
`brew install watchman`

2. (iOS) Install Xcode via the App store
3. (iOS) Install cocoapods:

`sudo gem install cocoapods`

4. (Android) Install the Java Development Kit:

`brew cask install adoptopenjdk/openjdk/adoptopenjdk8`

5. (Android) Install Android Studio: https://developer.android.com/studio/index.html
6. (Android) Install Android 10 (Q) package through Android Studio.
7. (Android) Install the SDK Tools package through Android Studio.
8. (Android) Configure the ANDROID_HOME environment variable.  Add the
following lines to your `$HOME/.bash_profile` or `$HOME/.bashrc` config file:

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

9. Type `source $HOME/.bash_profile` to load the config into your current shell.

---

## Windows Installation/Setup

1. Install Node, Python2, and the JDK if you do not already have them.
2. Install Android Studio, make sure that the boxes
`Android SDK`
`Android SDK Platform`
`Android Virtual Device`
are checked.
3. Install the Android 10 (Q) SDK through the SDK Manager in Android Studio.
4. Add a new `ANDROID_HOME` user variable to your environment variables which
points to the path to your Android SDK.  The SDK is installed by default at
`%LOCALAPPDATA%\Android\Sdk`
5. Add platform-tools to your Path variable.  The default installation location
is `%LOCALAPPDATA%\Android\Sdk\platform-tools`

---

## Linux Installation/Setup

1. Install Node 10 or newer
2. Install the JDK
3. Install Android Studio: https://developer.android.com/studio/index.html
Make sure that the following items are checked in the installation wizard:
`Android SDK`
`Android SDK Platform`
`Android Virtual Device`
4. Install the Anroid 10 (Q) SDK through the SDK Manager in Android Studio.
5. Configure the ANDROID_HOME environment variable.  Add the following lines
to your `$HOME/.bash_profile` or `$HOME/.bashrc`:
```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANRDOID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
6. Install Watchman: https://facebook.github.io/watchman/docs/install/#buildinstall

Your local environment should be setup.  We will be using the react-native CLI
throughout this documentation.  It came with your installation of node,
though there do exist other options which you are free to use.

---

# Starting an Emulator and Running the App

## Android Emulator

1. open ./OnAux/android in Android Studio
2. Open the AVD Manager in Android Studio and create a new AVD if you have not
created one before.
3. Click the green triangle button next to your AVD to launch it.
4. Open a terminal (or command prompt), navigate to ./OnAux and type:
`npx react-native start`
5. Open another terminal, navigate to ./OnAux and type:
`npx react-native run-android`

## iOS Emulator (Mac Only)

1. Open a terminal window, navigate to ./OnAux and type:
`npx react-native start`
2. Open another window, navigate to ./OnAux and type:
`npx react-native run-ios`

You should now see the app running in an emulator.

For additional resources consult
https://reactnative.dev/docs/environment-setup
