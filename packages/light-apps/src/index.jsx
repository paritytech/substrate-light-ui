"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./index.css");
const ui_components_1 = require("@polkadot/ui-components");
const serviceWorker = __importStar(require("./serviceWorker"));
const index_1 = __importDefault(require("./SideBar/index"));
function App(props) {
    return (<div className={'apps--App'}>
      <index_1.default>
        Hello
      </index_1.default>
    </div>);
}
const url = !ui_components_1.settings.apiUrl
    ? undefined
    : ui_components_1.settings.apiUrl;
ui_components_1.createApp(App, { url });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
