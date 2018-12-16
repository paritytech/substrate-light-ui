// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { NavLink } from 'react-router-dom';
import settings from '@polkadot/ui-settings';
import substrateLogo from '@polkadot/ui-assets/parity-substrate.svg';
import { RouteComponentProps } from 'react-router';
import 'semantic-ui-css/semantic.min.css';

import { createApp } from './createApp';
import { GlobalStyle } from './globalStyle';
import Content from './Content';

type Props = {};

const LOGO = substrateLogo;

function App (props: Props) {
  return (
    <div >
      <GlobalStyle />
      <NavLink to={'/'}>
        <img
          src={LOGO}
          height={100}
          width={150}
        />
      </NavLink>
      <Content {...({} as RouteComponentProps<any>)} />
    </div>
  );
}

const url = !settings.apiUrl
  ? undefined
  : settings.apiUrl;

createApp(App, { url });
