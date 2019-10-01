// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types/interfaces';
import { AppContext, handler, TxQueueContext, validate, AllExtrinsicData } from '@substrate/ui-common';
import { Balance, Form, Input, NavButton, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { CenterDiv, InputAddress, LeftDiv, RightDiv } from '../Transfer.styles';
import { MatchParams } from '../types';
import { Validation } from './Validation';

interface SendMatchParams extends MatchParams {
  recipientAddress?: string;
}

interface Props extends RouteComponentProps<SendMatchParams> { }

export function SendBalance (props: Props) {
  const { api, keyring } = useContext(AppContext);
  const { enqueue } = useContext(TxQueueContext);

  const { history, match: { params: { currentAccount, recipientAddress } } } = props;

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState<Index>();
  const [currentBalance, setCurrentBalance] = useState<DerivedBalances>();
  const [fees, setFees] = useState<DerivedFees>();
  const [recipientBalance, setRecipientBalance] = useState<DerivedBalances>();

  const extrinsic = api.tx.balances.transfer(recipientAddress, amountAsString);
  const values = validate({ amountAsString, accountNonce, currentBalance, extrinsic, fees, recipientBalance, currentAccount, recipientAddress }, api);

  const changeCurrentAccount = (newCurrentAccount: string) => {
    history.push(`/transfer/${newCurrentAccount}/${recipientAddress}`);
  };

  const changeRecipientAddress = (newRecipientAddress: string) => {
    history.push(`/transfer/${currentAccount}/${newRecipientAddress}`);
  };

  // Subscribe to sender's & receivers's balances, nonce and some fees
  useEffect(() => {
    if (!recipientAddress) {
      return;
    }

    const subscription = zip(
      api.derive.balances.fees(),
      api.derive.balances.votingBalance(currentAccount),
      api.derive.balances.votingBalance(recipientAddress),
      api.query.system.accountNonce<Index>(currentAccount)
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
    const values = validate({ amountAsString, accountNonce, currentBalance, extrinsic, fees, recipientBalance, currentAccount, recipientAddress }, api);

    values.fold(
      (error) => { console.error(error); },
      (allExtrinsicData: AllExtrinsicData) => {
        // If everything is correct, then submit the extrinsic
        const { extrinsic, amount, allFees, allTotal, recipientAddress: rcptAddress } = allExtrinsicData;

        enqueue(extrinsic, { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(currentAccount), recipientAddress: rcptAddress });
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
            onChange={handler(setAmountAsString)}
            placeholder='e.g. 1.00'
            type='number'
            value={amountAsString}
          />
        </CenterDiv>

        <RightDiv>
          <SubHeader textAlign='left'>Recipient Address:</SubHeader>
          <InputAddress
            label={undefined}
            onChange={changeRecipientAddress}
            type='all'
            value={recipientAddress}
            withLabel={false}
          />
          {recipientAddress && <Balance address={recipientAddress} />}
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
