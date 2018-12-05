"use strict";
// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const CHAINS = [
    {
        name: 'Development',
        chainId: 0,
        decimals: 0,
        unit: 'Unit'
    },
    {
        name: 'Local Testnet',
        chainId: 0,
        decimals: 0,
        unit: 'Unit'
    },
    {
        name: 'BBQ Birch',
        chainId: 68,
        decimals: 15,
        unit: 'BBQ'
    }
];
exports.CHAINS = CHAINS;
const ENDPOINTS = [
    { text: 'BBQ Birch (hosted by Parity)', value: 'wss://substrate-rpc.parity.io/' },
    { disabled: true, text: 'Polkadot PoC-3 (hosted by Parity)', value: 'wss://polkadot-rpc.polkadot.io/' },
    { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/' }
];
exports.ENDPOINTS = ENDPOINTS;
const LANGUAGES = [
    { value: 'default', text: 'Default browser language (auto-detect)' }
];
exports.LANGUAGES = LANGUAGES;
const UIMODES = [
    { value: 'full', text: 'Fully featured' },
    { value: 'light', text: 'Basic features only' }
];
exports.UIMODES = UIMODES;
const UITHEMES = [
    { value: 'substrate', text: 'Substrate' },
    { value: 'polkadot', text: 'Polkadot' }
];
exports.UITHEMES = UITHEMES;
