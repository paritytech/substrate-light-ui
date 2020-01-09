![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Build Status](https://travis-ci.org/paritytech/substrate-light-ui.svg?branch=master)](https://travis-ci.org/paritytech/substrate-light-ui)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=paritytech/substrate-light-ui)](https://dependabot.com)
<a href="https://codeclimate.com/github/paritytech/substrate-light-ui/maintainability"><img src="https://api.codeclimate.com/v1/badges/bdff9a9d1f154523d3b9/maintainability" /></a>

# Substrate Light UI

Light client focused user interface for the Polkadot and Substrate networks.

The Light UI is meant to be **an intuitive interface for beginner users** to easily interact with the main components of various Substrate chains. It is provided in two forms:

- A desktop application, built with Electron
- A Chrome/Firefox browser extension

Both provide the same functionalities and use the same UI, feel free to choose the medium that suits you best. For now, we don't provider binaries/packages, nor are the extensions on the Chrome/Firefox stores; you will need to [build from source](#build-from-sources) for now.

## Overview

As of v0.1.0, the main functions are as follows:

- [x] Identity management - manage accounts and addresses, including ability to create, edit, restore, backup, and forget them.

- [x] Transfer balance - send and receive funds in the currency of the relevant substrate chain.

And here is a rough roadmap of what's coming next (see the [0.2.0 milestone](https://github.com/paritytech/substrate-light-ui/milestone/1) for details):

- [ ] Light UI will be bundled with a light client - it won't rely on a remote node.

- [ ] Improve overall beginner-friendliness (e.g. [#67](https://github.com/paritytech/substrate-light-ui/issues/67))

And finally, here are some mid/long-term ideas we would like to explore with Light UI:

- [ ] Embed a light client in a browser extension, and let Light UI be the user interface of this extension.

## Build from sources

### Dependencies

Make sure you have [yarn >= 1.13.0](http://yarnpkg.com/) and [nodejs >= 10.10.0](https://nodejs.org/en/). Then run

```bash
git clone https://github.com/paritytech/substrate-light-ui
cd ./substrate-light-ui
yarn install
```

### Run the Electron App

```bash
yarn prod:electron
```

The building might take some time, but you should see an Electron application after a while.

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on macOS) from the Electron menu.

### Run the Browser Extension

```bash
yarn build:extension
```

Then install the extension

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

## Contributing

We welcome any and all contributions whether it is in the form of raising an issue, filing a PR, or participating in the discussions. Please read the [Contributing Docs](CONTRIBUTING.md) first.

### Run with Hot-Reloading

If you would like to run this project with hot-reloading, use the following commands:

- `yarn start:ui`: If you would only like to modify the UI, run this command and visit http://localhost:3000
- `yarn start:electron`: Run the Electron app with hot reloading
- `yarn start:extension`: Run the extension with hot reloading of the popup
