"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const account_management_1 = require("@polkadot/account-management");
exports.default = [
    {
        Component: account_management_1.AccountManagement,
        i18n: {
            defaultValue: 'AccountManagement'
        },
        icon: 'users',
        isApiGated: true,
        isHidden: false,
        name: 'accountManagement'
    }
];
