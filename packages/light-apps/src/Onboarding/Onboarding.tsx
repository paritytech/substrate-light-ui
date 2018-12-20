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
  value?: string,
  file?: Uint8Array
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

  handleFileUploaded = (data: Uint8Array) => {
    this.setState({
      file: data
    });
  }

  render () {
    const {
      onboardingStore: { isFirstRun }
    } = this.injected;

    console.log(isFirstRun);

    return (
      <Modal
        dimmer='inverted'
        open
        size='tiny'
      >
        <Container>
          <Modal.Header> Unlock Account </Modal.Header>
          <Modal.Content>
            <Stacked>
              {this.renderJSONCard()}
              <Modal.FadedText> or </Modal.FadedText>
              {this.renderPhraseCard()}
              {this.renderActions()}
            </Stacked>
          </Modal.Content>
        </Container>
      </Modal>
    );
  }

  renderJSONCard () {
    return (
      <div>
        <Modal.SubHeader> Restore Account from JSON Backup File </Modal.SubHeader>
        <InputFile onChange={this.handleFileUploaded}/>
      </div>
    );
  }

  renderPhraseCard () {
    const { value } = this.state;

    return (
      <div>
        <Modal.SubHeader> Import Account from Seed Phrase </Modal.SubHeader>
        <Input onChange={this.handleInputSeedPhrase} value={value} />
      </div>
    );
  }

  renderActions () {
    return (
      <Modal.Actions>
        <Stacked>
          <NavButton>Unlock</NavButton>
          <Modal.FadedText>or</Modal.FadedText>
          <NavLink> Create New Account </NavLink>
        </Stacked>
      </Modal.Actions>
    );
  }
}
