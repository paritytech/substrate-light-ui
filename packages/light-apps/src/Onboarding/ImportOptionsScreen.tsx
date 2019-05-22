// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Modal } from '@substrate/ui-components';

import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

export function ImportOptionsScreen () {
  return (
    <React.Fragment>
      <Modal.Header> Unlock Account </Modal.Header>
      <Modal.Content>
        <Switch>
          <Route path='/import/withJson' component={ImportWithJson} />
          <Route path='/import/withPhrase' component={ImportWithPhrase} />
        </Switch>
      </Modal.Content>
    </React.Fragment>
  );
}
