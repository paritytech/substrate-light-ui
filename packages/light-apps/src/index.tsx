// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable'; // https://github.com/mmiszy/react-with-observable#install
import ApiRx from '@polkadot/api/rx';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

// Pass in api in all Components via React context
const apiContext = { api: new ApiRx() };

ReactDOM.render(<App apiContext={apiContext} />, document.getElementById('root'));
