// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types/interfaces';
import { AppContext, handler, TxQueueContext, validate, AllExtrinsicData, Errors } from '@substrate/ui-common';
import { Balance, Form, Input, NavButton, Stacked, SubHeader, WrapperDiv, WithSpaceAround } from '@substrate/ui-components';
import { Either, left } from 'fp-ts/lib/Either';
import React, { useContext, useEffect, useState } from 'react';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { InputAddress } from '../Transfer.styles';
import { Validation } from './Validation';

interface Props {
  currentAccount: string;
  recipientAddress: string;
}

export function SendBalance (props: Props): React.ReactElement {
  const { api, keyring } = useContext(AppContext);
  const { enqueue } = useContext(TxQueueContext);

  const { currentAccount, recipientAddress } = props;

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState<Index>();
  const [currentBalance, setCurrentBalance] = useState<DerivedBalances>();
  const [fees, setFees] = useState<DerivedFees>();
  const [receiver, setReceiver] = useState<string>();
  const [recipientBalance, setRecipientBalance] = useState<DerivedBalances>();
  const [sender, setSender] = useState<string>();
  const [validationResult, setValidationResult] = useState<Either<Errors, AllExtrinsicData>>(left({ fees: 'fetching fees...' }));

  const extrinsic = api.tx.balances.transfer(recipientAddress, amountAsString);

  // Subscribe to sender's & receivers's balances, nonce and some fees
  useEffect(() => {
    if (!recipientAddress) {
      return;
    }

    setSender(currentAccount);
    setReceiver(recipientAddress);

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

    return (): void => subscription.unsubscribe();
  }, [currentAccount, recipientAddress]);

  useEffect(() => {
    const values = validate({ amountAsString, accountNonce, currentBalance, extrinsic, fees, recipientBalance, currentAccount, recipientAddress }, api);

    setValidationResult(values);
  }, [amountAsString, accountNonce, currentBalance, fees, recipientBalance, currentAccount, recipientAddress]);

  const changeCurrentAccount = (newCurrentAccount: string): void => {
    setSender(newCurrentAccount);
  };

  const changeRecipientAddress = (newRecipientAddress: string): void => {
    setReceiver(newRecipientAddress);
  };

  const handleSubmit = (): void => {
    validationResult.fold(
      (error) => { console.error(error); },
      (allExtrinsicData: AllExtrinsicData) => {
        // If everything is correct, then submit the extrinsic
        const { extrinsic, amount, allFees, allTotal, recipientAddress: rcptAddress } = allExtrinsicData;

        enqueue(extrinsic, { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(currentAccount), recipientAddress: rcptAddress });
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <WrapperDiv>
        <Stacked alignItems='flex-start' justifyContent='flex-start'>
          <SubHeader textAlign='left'>Sender Account:</SubHeader>
          <InputAddress
            isDisabled
            onChangeAddress={changeCurrentAccount}
            type='account'
            value={sender}
            withLabel={false}
          />
          <Balance address={currentAccount} />
        </Stacked>
      </WrapperDiv>

      <WrapperDiv>
        <Stacked alignItems='flex-start' justifyContent='flex-start'>
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
        </Stacked>
      </WrapperDiv>

      <WrapperDiv>
        <Stacked alignItems='flex-start' justifyContent='flex-start'>
          <SubHeader textAlign='left'>Recipient Address:</SubHeader>
          <InputAddress
            label={undefined}
            onChangeAddress={changeRecipientAddress}
            type='all'
            value={receiver}
            withLabel={false}
          />
          {recipientAddress && <Balance address={recipientAddress} />}
        </Stacked>
      </WrapperDiv>

      <WithSpaceAround>
        <Validation values={validationResult} />
      </WithSpaceAround>
      <NavButton disabled={validationResult.isLeft()}>Submit</NavButton>
    </Form>
  );
}
