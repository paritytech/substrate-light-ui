// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FadedText, Modal, Stacked, SubHeader, WithSpaceAround, StyledNavButton } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { TERMS_AND_CONDITIONS } from '../constants';

interface Props extends RouteComponentProps {}

export function TermsAndConditions (props: Props) {
  const { history } = props;

  const navToCreateStash = () => {
    history.push('/onboarding/stash');
  };

  return (
    <WithSpaceAround>
      <Modal.Content>
        <div style={{ maxHeight: '25%', overflow: 'auto' }}>
          {TERMS_AND_CONDITIONS}
        </div>
      </Modal.Content>
      <Modal.Content extra>
        <WithSpaceAround>
          <Stacked>
            <SubHeader margin='small'>As a nominator on Polkadot's NPOS Relay Chain, you have the ability to stake your tokens toward the validators that you deem to be reliable.</SubHeader>
            <FadedText>Your nominations are crucial to enhancing the overall security of the network.</FadedText>
          </Stacked>
        </WithSpaceAround>
      </Modal.Content>
      <Modal.Actions>
        <StyledNavButton onClick={navToCreateStash}> Proceed </StyledNavButton>
      </Modal.Actions>
    </WithSpaceAround>
  );
}
