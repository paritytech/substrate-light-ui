![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
[![Build Status](https://travis-ci.org/paritytech/substrate-light-ui.svg?branch=master)](https://travis-ci.org/paritytech/substrate-light-ui)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=paritytech/substrate-light-ui)](https://dependabot.com)
<a href="https://codeclimate.com/github/paritytech/substrate-light-ui/maintainability"><img src="https://api.codeclimate.com/v1/badges/bdff9a9d1f154523d3b9/maintainability" /></a>

# Substrate Light UI

Light client focused user interface for the Polkadot and Substrate networks.

The Light UI is meant to be **an intuitive interface for beginner users** to easily interact with the main components of various Substrate chains.

## [» Download the latest release (macOS only) «](https://github.com/paritytech/substrate-light-ui/releases/latest)

Linux and Windows binaries are planned, but need more time. For Linux and Windows users, please [build the project manually](#build-this-repo-and-run) for now.

## Overview

As of v0.1.0, the main functions are as follows:

- [x] Identity management - manage accounts and addresses, including ability to create, edit, restore, backup, and forget them.

- [x] Transfer balance - send and receive funds in the currency of the relevant substrate chain.

And here is a rough roadmap of what's coming next (see the [0.2.0 milestone](https://github.com/paritytech/substrate-light-ui/milestone/1) for details):

- [ ] Staking/Nominating/Voting democracy - stake tokens, nominate validators, and vote for proposals regarding the the current chain (see [#62](https://github.com/paritytech/substrate-light-ui/issues/62)).

- [ ] Light UI will be bundled with a light client - it won't rely on a remote node.

- [ ] Improve overall beginner-friendliness (e.g. [#67](https://github.com/paritytech/substrate-light-ui/issues/67))

And finally, here are some mid/long-term ideas we would like to explore with Light UI:

- [ ] Embed a light client in a browser extension, and let Light UI be the user interface of this extension.

## Build from sources

### Dependencies

Make sure you have [yarn >= 1.13.0](http://yarnpkg.com/) and [nodejs >= 10.10.0](https://nodejs.org/en/).

For now, you also need to have a Substrate node on your local machine. Before running the commands below, you need to:
- either run the substrate node beforehand (see [Run Substrate Locally](#run-substrate-locally-httpssubstratereadmeio)),
- or copy it into `./packages/electron-app/static`, and Electron will take care of running it.

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

### Build binaries

This command takes more time than the previous, but it'll produce a fully standalone binary.

```bash
yarn package
```

### Run with live reload for development

```bash
yarn start
```

> Troubleshooting: If it hangs on a white screen in Electron even though it has compiled and has been syncing for a long time, then simply choose 'View > Reload' (CMD + R on macOS) from the Electron menu.

### Run Substrate Locally (https://substrate.readme.io/)

In development it can be useful to have a local dev instance of Substrate running. You can do this by running:
```
curl https://getsubstrate.io -sSf | bash
```
to get the latest Substrate (it is a fast moving project and things break a lot so if you find things are breaking on master, make sure you're not running a very outdated version).

To run it:
```
substrate --dev
```

## Contributing

We welcome any and all contributions whether it is in the form of raising an issue, filing a PR, or participating in the discussions. Please read the [Contributing Docs](CONTRIBUTING.md) first.
