// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InputFile, Modal, NavLink, Stacked } from '@polkadot/ui-components';
import { u8aToString } from '@polkadot/util';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

export class ImportWithJson extends React.PureComponent<Props> {
  private handleFileUploaded = async (file: Uint8Array) => {
    const { history } = this.props;

    const jsonString = u8aToString(file);

    history.push(`/save/withJson/${jsonString}`);
  }

  render () {
    return (
      <React.Fragment>
        <Stacked>
          <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
          <InputFile onChange={this.handleFileUploaded} />
          <Modal.Actions>
            <Stacked>
              <NavLink to='/import/withPhrase'> Import with Phrase Instead </NavLink>
              <Modal.FadedText>or</Modal.FadedText>
              <NavLink to='/create'> Create New Account </NavLink>
            </Stacked>
          </Modal.Actions>
        </Stacked>
      </React.Fragment>
    );
  }
}
