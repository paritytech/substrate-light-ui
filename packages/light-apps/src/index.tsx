// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import keyringInstance from '@polkadot/ui-keyring';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

// Global setups for the app
const api = new ApiRx();
keyringInstance.loadAll();

ReactDOM.render(<App api={api} />, document.getElementById('root'));
