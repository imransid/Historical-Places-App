# Historical Places App (React Native)

This repository contains a full‑featured **React Native** mobile application that
lists famous historical sites and allows users to keep track of which ones
they have visited. It serves as a reference implementation of modern React Native
development practices: state management with
[`@reduxjs/toolkit`](https://redux-toolkit.js.org/), persistence with
`redux-persist`, action logging with `redux-logger` and an animated splash
screen powered by
[react‑native‑reanimated](https://docs.swmansion.com/react-native-reanimated/).

The project is written in TypeScript and uses a **module alias** (`@`) to
simplify import paths. When you see imports such as `@/store` or
`@/navigation/AppNavigator`, they resolve into files inside the `src` directory
thanks to the `module-resolver` Babel plugin and matching configuration in
`tsconfig.json`. A custom persist transform ensures only the minimal state
(visited flags and the last suggestion) is stored to disk.

## Features

- **List of places** – Shows a scrollable list of historical sites loaded from static JSON data. Each item displays the name and a short description.
- **Mark visited** – A switch on each list row toggles the visited state. Visited information is persisted across app restarts.
- **Random suggestion** – Tap the "Suggest Random Place" button to highlight a random entry and optionally jump directly to its details.
- **Detail view** – Displays a larger image, full description and visited toggle for an individual place.
- **Animated splash screen** – On launch, an animated splash screen fades and scales in the app title before transitioning to the main app. The animation uses Reanimated and is carefully written to run on the UI thread via `runOnJS` to avoid worklet violations.
- **State persistence** – Only the visited statuses and last suggestion are saved to persistent storage to minimise the amount of data stored. This is achieved with a custom [`placesMinimalTransform`](./src/store/persistTransform.js).
- **Development logger** – In development mode, every dispatched Redux action is printed to the console via `redux-logger` to aid debugging. Logging is disabled in production builds.
- **TypeScript and aliases** – The project is fully typed via TypeScript and uses a single `@` alias to refer to the `src` folder (for example, `@/store`, `@/screens`). This makes import paths short and clear.

## Getting Started

### Prerequisites

- **Node.js ≥ 20.19.4** – React Native 0.81.x requires Node 20.19.4 or newer in the 20 LTS line. Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage versions. A `.nvmrc` file is included so `nvm use` will automatically switch to the correct version.
- **React Native CLI environment** – You need a working Xcode installation (for iOS) and the Android SDK (for Android). Follow the [environment setup guide](https://reactnative.dev/docs/environment-setup) for React Native CLI.
- **Yarn package manager** – The commands below use `yarn`. If you prefer `npm`, adjust accordingly.

**Tip:** If you switch the Reanimated plugin or alias configuration, clear Metro’s cache by running `yarn start --reset-cache` to avoid stale module resolution errors.

### Installation

1. Clone this repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd historical-places-app
   # Ensure the correct Node version
   nvm use   # loads Node version from .nvmrc
   # Install JavaScript and native dependencies
   yarn install
   # install iOS pods (macOS only)
   npx pod-install ios
   ```

2. Run the Metro bundler:

   ```bash
   yarn start
   ```

3. In a separate terminal, launch the app on an emulator or device:

   ```bash
   # To run on iOS simulator (requires macOS and Xcode)
   yarn ios

   # To run on an Android emulator or device
   yarn android
   ```

When you launch the app it will show an animated splash screen and then list the historical places. You can mark places as visited, view details and jump directly to a randomly suggested place.

## Project Structure and Alias

```
MyHistoricalApp/
├── App.js                     # Root component with Provider, PersistGate and Splash
├── babel.config.js            # Babel configuration with Reanimated plugin
├── .nvmrc                     # Node version specification
└── src/
    ├── navigation/
    │   └── AppNavigator.js    # Stack navigator definitions
    ├── screens/
    │   ├── HomeScreen.js      # List view with toggle switches and random suggestion
    │   ├── DetailScreen.js    # Details for a single place
    │   └── SplashScreen.js    # Animated splash using Reanimated and runOnJS
    ├── components/
    │   └── PlaceListItem.js   # Reusable list item component
    ├── data/
    │   └── places.js          # Mock data of historical places
    └── store/
        ├── index.js           # Configures Redux store with persist and logger
        ├── persistTransform.js# Custom persist transform to ignore static lists
        └── places/
            └── placesSlice.js # Redux Toolkit slice for place state
```

### Alias usage

Thanks to the `module-resolver` plugin and the path configuration in `tsconfig.json`,
the `@` symbol maps to the `src` directory. This means you can import modules
cleanly without long relative paths. For example:

```js
// instead of '../../../store/index'
import store from '@/store';
// instead of '../../navigation/AppNavigator'
import AppNavigator from '@/navigation/AppNavigator';
```

If you modify the alias mapping, remember to update both `babel.config.js` and
`tsconfig.json` to keep Metro, TypeScript and Jest (if used) in sync.
