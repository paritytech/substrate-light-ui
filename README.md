![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Actions Status](https://github.com/paritytech/substrate-light-ui/workflows/pr/badge.svg)](https://github.com/paritytech/substrate-light-ui/actions)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=paritytech/substrate-light-ui)](https://dependabot.com)
[![CodeClimate](https://api.codeclimate.com/v1/badges/bdff9a9d1f154523d3b9/maintainability)](https://codeclimate.com/github/paritytech/substrate-light-ui/maintainability)

# Lichen (working title, previously "Substrate Light UI")

Lichen is a light-client-based, in-browser wallet for Substrate.

The Light UI is meant to be **an intuitive interface for beginner users** to easily interact with various Substrate chains. It is provided in two forms:

- A Chrome/Firefox browser extension
- A desktop application, built with Electron

Both provide the same functionalities and use the same UI, feel free to choose the medium that suits you best.

A _very alpha_ version of the browser extension can be found in the [Github Releases](https://github.com/paritytech/substrate-light-ui/releases) page.

You can also check out the `master` branch and [build from source](#build-from-sources).

## Overview

As of v0.3.0, the main functions are as follows:

- [x] Identity management - manage accounts and addresses, including ability to create, edit, restore, backup, and forget them.
- [x] Transfer balance - send and receive funds in the currency of the relevant substrate chain.
- [x] Embed a light client in a browser extension, and let Light UI be the user interface of this extension.

And here is a rough roadmap of what's coming next (see the [`v0.4.0-MVP` milestone](https://github.com/paritytech/substrate-light-ui/milestone/3) for details):

- [ ] Handle changing:
  - [x] provider,
  - [x] chain spec,
  - [ ] user uploaded light client WASM blob or chain spec.
- [ ] Provider injection inside dapps.
- [ ] Improve overall beginner-friendliness (e.g. [#67](https://github.com/paritytech/substrate-light-ui/issues/67)).

## Build from sources

### Dependencies

Make sure you have [yarn >= 1.13.0](http://yarnpkg.com/) and [nodejs >= 10.10.0](https://nodejs.org/en/). Then run

```bash
git clone https://github.com/paritytech/substrate-light-ui
cd ./substrate-light-ui
yarn install
```

### Run the Browser Extension

```bash
yarn build:extension
```

Then install the extension:

- Chrome:
  - go to `chrome://extensions/`
  - ensure you have the Development flag set
  - "Load unpacked" and point to `packages/extension-app/build`
  - if developing, after making changes - refresh the extension
- Firefox:
  - go to `about:debugging#addons`
  - check "Enable add-on debugging"
  - click on "Load Temporary Add-on" and point to `packages/extension-app/build/manifest.json`
  - if developing, after making changes - reload the extension

### Run the Electron App

For now, you need to bundle a Substrate node manually into the Electron app. To do so, first build a Substrate node for your platform (note: it can of course be a Polkadot/Kusama node, or any other Substrate node), and copy it as `./packages/electron-app/static/substrate`:

```bash
cp /path/to/polkadot ./packages/electron-app/static/substrate
```

Then run:

```bash
yarn build:electron
```

The building might take some time, but you should see an Electron application after a while.

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on macOS) from the Electron menu.

## Contributing

We welcome any and all contributions whether it is in the form of raising an issue, filing a PR, or participating in the discussions. Please read the [Contributing Docs](CONTRIBUTING.md) first.

### Run with Hot-Reloading

If you would like to run this project with hot-reloading, use the following commands:

- `yarn start:ui`: If you would only like to modify the UI, run this command and visit http://localhost:3000
- `yarn start:electron`: Run the Electron app with hot reloading
