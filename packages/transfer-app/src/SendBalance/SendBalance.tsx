// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types';
import { logger } from '@polkadot/util';
import { AppContext, TxQueueContext } from '@substrate/ui-common';
import { Balance, Form, Input, NavButton, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Observable, zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { CenterDiv, InputAddress, LeftDiv, RightDiv } from '../Transfer.styles';
import { MatchParams } from '../types';
import { validate } from './validate';
import { Validation } from './Validation';

interface SendMatchParams extends MatchParams {
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<SendMatchParams> { }

const l = logger('transfer-app');

export function SendBalance (props: Props) {
  const { api, keyring } = useContext(AppContext);
  const { submit } = useContext(TxQueueContext);

  const { history, match: { params: { currentAccount, recipientAddress } } } = props;

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  const [fees, setFees] = useState();
  const [recipientBalance, setRecipientBalance] = useState();

  const values = validate({ amountAsString, accountNonce, currentBalance, fees, recipientBalance, currentAccount, recipientAddress }, api);

  const changeCurrentAccount = (newCurrentAccount: string) => {
    history.push(`/transfer/${newCurrentAccount}/${recipientAddress}`);
  };

  const changeRecipientAddress = (newRecipientAddress: string) => {
    history.push(`/transfer/${currentAccount}/${newRecipientAddress}`);
  };

  const handleChangeAmount = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setAmountAsString(value);
  };

  // Subscribe to sender's & receivers's balances, nonce and some fees
  useEffect(() => {
    if (!recipientAddress) {
      return;
    }

    const subscription = zip(
      api.derive.balances.fees() as unknown as Observable<DerivedFees>,
      api.derive.balances.votingBalance(currentAccount) as unknown as Observable<DerivedBalances>,
      api.derive.balances.votingBalance(recipientAddress) as unknown as Observable<DerivedBalances>,
      api.query.system.accountNonce(currentAccount) as unknown as Observable<Index>
    )
      .pipe(
        take(1)
      )
      .subscribe(([fees, currentBalance, recipientBalance, accountNonce]) => {
        setFees(fees);
        setCurrentBalance(currentBalance);
        setRecipientBalance(recipientBalance);
        setAccountNonce(accountNonce);
      });
    return () => subscription.unsubscribe();
  }, [currentAccount, recipientAddress]);

  const handleSubmit = () => {
    const values = validate({ amountAsString, accountNonce, currentBalance, fees, recipientBalance, currentAccount, recipientAddress }, api);

    values.fold(
      () => {/* Do nothing if error */ },
      (allExtrinsicData) => {
        // If everything is correct, then submit the extrinsic

        const { extrinsic, amount, allFees, allTotal } = allExtrinsicData;

        l.log('Sending tx from', currentAccount, 'to', recipientAddress, 'of amount', amount);

        const senderPair = keyring.getPair(currentAccount);
        submit({ extrinsic, amount, allFees, allTotal, senderPair, recipientAddress: recipientAddress as any });
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <StackedHorizontal alignItems='flex-start'>
        <LeftDiv>
          <SubHeader textAlign='left'>Sender Account:</SubHeader>
          <InputAddress
            isDisabled
            onChange={changeCurrentAccount}
            type='account'
            value={currentAccount}
            withLabel={false}
          />
          <Balance address={currentAccount} />
        </LeftDiv>

        <CenterDiv>
          <SubHeader textAlign='left'>Amount:</SubHeader>
          <Input
            fluid
            label='UNIT'
            labelPosition='right'
            min={0}
            onChange={handleChangeAmount}
            placeholder='e.g. 1.00'
            type='number'
            value={amountAsString}
          />
        </CenterDiv>

        <RightDiv>
          <SubHeader textAlign='left'>Recipient Address:</SubHeader>
          <InputAddress
            label={null}
            onChange={changeRecipientAddress}
            type='all'
            value={recipientAddress}
            withLabel={false}
          />
          <Balance address={recipientAddress} />
        </RightDiv>
      </StackedHorizontal>
      <StackedHorizontal>
        <LeftDiv />
        <CenterDiv>
          <Validation values={values} />
        </CenterDiv>
        <RightDiv>
          <NavButton disabled={values.isLeft()}>Submit</NavButton>
        </RightDiv>
      </StackedHorizontal>
    </Form>
  );
}
