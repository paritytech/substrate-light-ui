"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
function createApp(App, { api, className, provider, style, url } = {}, rootId = 'root') {
    const rootElement = document.getElementById(rootId);
    if (!rootElement) {
        throw new Error(`Unable to find element with id '${rootId}'`);
    }
    react_dom_1.default.render(<react_router_dom_1.HashRouter>
      <App className={className} style={style}/>
    </react_router_dom_1.HashRouter>, rootElement);
}
exports.createApp = createApp;
__export(require("./settings"));
