// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import { Card, Stacked, Input, NavButton, SubHeader, Header, MarginTop, WithSpace, WithSpaceAround } from './index';

type Props = {
  handleFirstInput: (value: string) => void,
  handleSecondInput: (value: string) => void,
  handleSubmit: () => void,
  header: string,
  subheader: string,
  actionButtonValue: string,
  firstInputLabel: string,
  secondInputLabel: string
};

class WalletCard extends React.Component<Props> {
  render () {
    const { actionButtonValue, header, subheader, firstInputLabel, secondInputLabel, handleFirstInput, handleSecondInput, handleSubmit } = this.props;

    return (
      <Card raised>
        <WithSpaceAround>
          <Header margin={'0.2rem 0'}> {header} </Header>
          <SubHeader margin={'0rem auto'}> {subheader} </SubHeader>
          <Stacked>
            <Stacked justify={'flex-start'} textAlign={'left'}>
              <WithSpace>
                <Input
                  label={firstInputLabel}
                  type='text'
                  onChange={handleFirstInput}
                  withLabel />
                <MarginTop />
                <Input
                  label={secondInputLabel}
                  type='text'
                  onChange={handleSecondInput}
                  withLabel />
              </WithSpace>
            </Stacked>
            <NavButton onClick={handleSubmit} value={actionButtonValue} />
          </Stacked>
        </WithSpaceAround>
      </Card>
    );
  }
}

export default WalletCard;
