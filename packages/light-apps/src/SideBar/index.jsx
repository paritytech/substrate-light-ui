"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ui_components_1 = require("@polkadot/ui-components");
const react_1 = __importDefault(require("react"));
const routing_1 = __importDefault(require("../routing"));
const parity_substrate_white_svg_1 = __importDefault(require("../static/parity-substrate-white.svg"));
class SideBar extends react_1.default.Component {
    render() {
        const { children } = this.props;
        return (<div className='apps--SideBar'>
        <ui_components_1.Menu secondary vertical>
          <img alt='substrate' className='apps--SideBar-logo' src={parity_substrate_white_svg_1.default}/>
          {routing_1.default.routes
            .filter((route) => !route || !route.isHidden)
            .map((route, index) => (route || <div> Hey bitch </div>))}
          <ui_components_1.Menu.Divider hidden/>
          <ui_components_1.Menu.Item className='apps--SideBar-Item'>
            <a className='apps--SideBar-Item-NavLink' href='https://github.com/polkadot-js/apps'>
              <ui_components_1.Icon name='github'/> GitHub
            </a>
          </ui_components_1.Menu.Item>
          <ui_components_1.Menu.Divider hidden/>
          {children}
        </ui_components_1.Menu>
      </div>);
    }
}
exports.default = SideBar;
