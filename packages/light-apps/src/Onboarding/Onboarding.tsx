// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Input, InputFile, Modal, NavButton, NavLink, Stacked } from '@polkadot/ui-components';

import { OnboardingStoreInterface } from '../stores/interfaces';

type Props = {};
interface InjectedProps extends Props {
  onboardingStore: OnboardingStoreInterface;
}

type State = {
  value?: string
};

@inject('onboardingStore')
@observer
export class Onboarding extends React.Component<State, Props> {
  state: State = {};

  get injected () {
    return this.props as InjectedProps;
  }

  handleInputSeedPhrase = (val: string) => {
    this.setState({
      value: val
    });
  }

  render () {
    const {
      onboardingStore: { isFirstRun }
    } = this.injected;
    const { value } = this.state;

    console.log(isFirstRun);

    return (
      <Modal
        dimmer='inverted'
        open
        size='small'
      >
        <Container>
          <Modal.Header> Unlock Account </Modal.Header>
          <Modal.Content>
            <Stacked>
              <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
              <InputFile />
              <Modal.FadedText> or </Modal.FadedText>
              <Modal.SubHeader> Import Account from Seed Phrase </Modal.SubHeader>
              <Input onChange={this.handleInputSeedPhrase} value={value} />
              <Modal.Actions>
                <Stacked>
                  <NavButton> Unlock </NavButton>
                  <Modal.FadedText>or</Modal.FadedText>
                  <NavLink> Create New Account </NavLink>
                </Stacked>
              </Modal.Actions>
            </Stacked>
          </Modal.Content>
        </Container>
      </Modal>
    );
  }
}
