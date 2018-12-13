# light-ui
Light client focused user interface for the Polkadot network. It is currently being built as an Electron app, and will be migrated to a web app once wasm compilation of the Substrate Light API is available.

### Overview
This is the repository for Substrate light client's user interface. The light-ui is meant to be an intuitive interface for beginner users to easily be able to interact with the main components of various a Substrate chains. This UI builds upon Gavin Wood's live demo from Web 3 Summit: https://youtu.be/0IoUZdDi5Is?t=3858

As of now, the main functions are as follows, in order of priority:

* Identity management - manage accounts and addresses, including ability to create, edit, restore, backup, and forget them.

* Transfer balance - send and receive funds in the currency of the relevant substrate chain.

* Runtime module upgrade - submit a proposal to upgrade the underlying runtime (basically the state transition function) of the current chain.

* Staking/Nominating/Voting democracy - stake tokens, nominate validators, and vote for proposals regarding the the current chain.

### How to run
```
git clone https://github.com/polkadot-js/light-ui
cd light-ui
nvm use stable
yarn
yarn start
```
