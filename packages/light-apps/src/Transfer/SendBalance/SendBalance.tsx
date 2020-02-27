// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesAll, DerivedFees } from '@polkadot/api-derive/types';
import ApiRx from '@polkadot/api/rx';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { AccountData, Index } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import {
  ApiContext,
  handler,
  KeyringContext,
  TxQueueContext,
} from '@substrate/context';
import {
  Balance,
  Form,
  Input,
  NavButton,
  Stacked,
  SubHeader,
  WithSpaceAround,
  WrapperDiv,
} from '@substrate/ui-components';
import { Either, left } from 'fp-ts/lib/Either';
import React, { useContext, useEffect, useState } from 'react';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { InputAddress } from '../Transfer.styles';
import { AllExtrinsicData, Errors } from './types';
import { validate } from './validate';
import { Validation } from './Validation';

/**
 * Check if an address is valid, with the current api.
 */
function isAddressValid(api: ApiRx, address: string): boolean {
  try {
    api.createType('Address', address);

    return true;
  } catch (e) {
    return false;
  }
}

export function SendBalance(): React.ReactElement {
  const { api } = useContext(ApiContext);
  const { enqueue } = useContext(TxQueueContext);
  const {
    accounts,
    addresses,
    currentAccount,
    keyring,
    setCurrentAccount,
  } = useContext(KeyringContext);

  const senderAddress = currentAccount || Object.keys(accounts)[0];

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState<
    ITuple<[Index, AccountData]>
  >();
  const [currentBalance, setCurrentBalance] = useState<DerivedBalancesAll>();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [fees, setFees] = useState<DerivedFees>();
  const [receiver, setReceiver] = useState<string>(
    (Object.keys(addresses) || Object.keys(accounts))[0]
  );
  const [recipientBalance, setRecipientBalance] = useState<
    DerivedBalancesAll
  >();
  const [validationResult, setValidationResult] = useState<
    Either<Errors, AllExtrinsicData>
  >(left({ fees: 'fetching fees...' }));

  const isReceiverValid = isAddressValid(api, receiver);

  // Subscribe to sender's & receivers's balances, nonce and some fees
  useEffect(() => {
    if (!isReceiverValid) {
      return;
    }

    setExtrinsic(api.tx.balances.transfer(receiver, amountAsString));

    const subscription = zip(
      api.derive.balances.fees(),
      api.derive.balances.votingBalance(senderAddress),
      api.derive.balances.votingBalance(receiver),
      api.query.system.account(senderAddress)
    )
      .pipe(take(1))
      .subscribe(([fees, currentBalance, recipientBalance, accountNonce]) => {
        setFees(fees);
        setCurrentBalance(currentBalance);
        setRecipientBalance(recipientBalance);
        setAccountNonce(accountNonce);
      });

    return (): void => subscription.unsubscribe();
  }, [
    amountAsString,
    api,
    currentAccount,
    isReceiverValid,
    receiver,
    senderAddress,
  ]);

  useEffect(() => {
    const values = validate({
      amountAsString,
      accountNonce,
      currentBalance,
      extrinsic,
      fees,
      recipientBalance,
      currentAccount,
      recipientAddress: receiver,
    });

    setValidationResult(values);
  }, [
    amountAsString,
    accountNonce,
    currentBalance,
    fees,
    recipientBalance,
    extrinsic,
    currentAccount,
    receiver,
  ]);

  const handleSubmit = (): void => {
    validationResult.fold(
      error => {
        console.error(error);
      },
      (allExtrinsicData: AllExtrinsicData) => {
        // If everything is correct, then submit the extrinsic
        const {
          extrinsic,
          amount,
          allFees,
          allTotal,
          recipientAddress: rcptAddress,
        } = allExtrinsicData;

        enqueue(extrinsic, {
          amount,
          allFees,
          allTotal,
          methodCall: extrinsic.meta.name.toString(),
          senderPair: keyring.getPair(senderAddress),
          recipientAddress: rcptAddress,
        });
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stacked>
        <WrapperDiv>
          <Stacked alignItems='flex-start' justifyContent='flex-start'>
            <SubHeader textAlign='left'>Sender Account:</SubHeader>
            <InputAddress
              accounts={accounts}
              addresses={addresses}
              onChangeAddress={setCurrentAccount}
              type='accounts'
              value={senderAddress}
            />
            <Balance address={senderAddress} api={api} orientation='vertical' />
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
            <Input fluid onChange={handler(setReceiver)} value={receiver} />
            {isReceiverValid && (
              <Balance address={receiver} api={api} orientation='vertical' />
            )}
          </Stacked>
        </WrapperDiv>

        <WithSpaceAround>
          <Validation values={validationResult} />
        </WithSpaceAround>
        <NavButton disabled={validationResult.isLeft()}>Submit</NavButton>
      </Stacked>
    </Form>
  );
}
