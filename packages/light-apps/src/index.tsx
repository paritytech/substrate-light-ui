// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable'; // TO make es6 observables work
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

ReactDOM.render(<App />, document.getElementById('root'));
