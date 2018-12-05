"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accountManagement_1 = __importDefault(require("./accountManagement"));
const governance_1 = __importDefault(require("./governance"));
// import transfer from './transfer';
const routes = [].concat(accountManagement_1.default, governance_1.default
// transfer
);
exports.default = {
    default: 'accountManagement',
    routes
};
