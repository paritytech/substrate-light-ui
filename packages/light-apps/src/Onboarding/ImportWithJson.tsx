// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext } from '@substrate/ui-common';
import { FadedText, InputFile, NavLink, Stacked, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

interface Props extends RouteComponentProps { }

export class ImportWithJson extends React.PureComponent<Props> {
  static contextType = AlertsContext;

  context!: React.ContextType<typeof AlertsContext>;

  handleFileUploaded = async (file: string | null) => {
    const { history } = this.props;
    const { enqueue } = this.context;

    try {
      if (!file) {
        throw new Error('File was empty. Make sure you uploaded the correct file and try again.');
      }

      history.push('/save/withJson/', { jsonString: file });
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error'
      });
    }
  }

  render () {
    return (
      <React.Fragment>
        <Stacked>
          <SubHeader> Restore Account from JSON Backup File </SubHeader>
          <InputFile onChange={this.handleFileUploaded} />
          <Modal.Actions>
            <Stacked>
              <NavLink to='/import/withPhrase'> Import with Phrase Instead </NavLink>
              <FadedText>or</FadedText>
              <NavLink to='/create'> Create New Account </NavLink>
            </Stacked>
          </Modal.Actions>
        </Stacked>
      </React.Fragment>
    );
  }
}
