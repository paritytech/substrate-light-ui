// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Modal } from '@polkadot/ui-components';

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';

interface Props extends RouteComponentProps {}

export class ImportOptionsScreen extends React.Component<Props> {
  render () {
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
}
