# electron-app

Build an Electron application, using `electron-webpack` and `electron-builder`.

## How it works

### `yarn build`

This command assumes that we've built a CRA app inside `packages/light-apps`. It will copy the built files into electron-webpack's `static/` folder, and tell Electron to serve these files.

### `yarn start`

Runs `electron-webpack dev`, which tells Electron to load http://localhost:3000, which is most likely the port on which CRA's dev mode runs. It reloads Electron on any code change inside the electron codebase.
