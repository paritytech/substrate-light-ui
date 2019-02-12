# substrate-light-ui

Light client focused user interface for the Polkadot and Substrate networks. It is currently being built as an Electron app, and will be migrated to a web app once wasm compilation of the Substrate Light node is available.

## Overview

This is the repository for Substrate light client's user interface. The light-ui is meant to be an intuitive interface for beginner users to easily be able to interact with the main components of various Substrate chains.

As of now, the main functions are as follows, in order of priority:

* Identity management - manage accounts and addresses, including ability to create, edit, restore, backup, and forget them.

* Transfer balance - send and receive funds in the currency of the relevant substrate chain.

* Staking/Nominating/Voting democracy - stake tokens, nominate validators, and vote for proposals regarding the the current chain.

## Build from sources

### Dependencies

Make sure you have [yarn >= 1.4.2](http://yarnpkg.com/) and [nodejs >= 10.10.0](https://nodejs.org/en/).

For now, you also need to have an instance of [Substrate](https://github.com/paritytech/substrate) running locally on your machine. We plan of course to bundle Substrate into the Electron app very soon.

### Clone this repo

```bash
git clone https://github.com/paritytech/substrate-light-ui
cd ./substrate-light-ui
yarn install
```

### Build this repo and run

```bash
yarn electron
```

### Build binaries (takes more time)

```bash
yarn package
```

### Run with live reload for development

```bash
yarn start
```

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on macOS) from the Electron menu. If the menu is not shown in the tray, then by clicking the Electron window and then holding down the ALT key to reveal it.
