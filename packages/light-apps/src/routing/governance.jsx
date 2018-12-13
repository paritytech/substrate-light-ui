"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const governance_1 = require("@polkadot/governance");
exports.default = [
    {
        Component: governance_1.Governance,
        i18n: {
            defaultValue: 'Governance'
        },
        icon: 'calendar check',
        isApiGated: true,
        isHidden: false,
        name: 'governance'
    }
];
