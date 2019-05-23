// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Menu } from '@substrate/ui-components';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

interface Props extends RouteComponentProps { }

export function Restore (props: Props) {
  const [screen, setScreen] = useState('JSON');

  return (
    <React.Fragment>
      <Menu secondary>
        <Menu.Item active={screen === 'JSON'} onClick={() => setScreen('JSON')}> With JSON </Menu.Item>
        <Menu.Item active={screen === 'Phrase'} onClick={() => setScreen('Phrase')}> With Phrase </Menu.Item>
      </Menu>
      {
        screen === 'JSON'
          ? <ImportWithJson {...props} />
          : <ImportWithPhrase {...props} />
      }
    </React.Fragment>
  );
}
