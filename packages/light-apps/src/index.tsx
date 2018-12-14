// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink } from 'react-router-dom';
import { settings } from '@polkadot/ui-components';

import * as serviceWorker from './serviceWorker';
import { createApp } from './createApp';
import { GlobalStyle } from './globalStyle';
import Content from './Content';
import substrateLogo from './static/parity-substrate.svg';

type Props = {};

const LOGO = substrateLogo;

function App (props: Props) {
  return (
    <div className={'apps--App'}>
      <GlobalStyle />
        <NavLink to={'/'}>
          <img
            src={LOGO}
            height={100}
            width={150} />
        </NavLink>
      <Content />
    </div>
  );
}

const url = !settings.apiUrl
  ? undefined
  : settings.apiUrl;

createApp(App, { url });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
