// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveFees } from '@polkadot/api-derive/types';
import ApiRx from '@polkadot/api/rx';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { AccountInfo } from '@polkadot/types/interfaces';
import { ApiContext, handler } from '@substrate/context';
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

import { AccountContext } from '../../ContextGate/context';
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
  const { accounts } = useContext(AccountContext);

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState<AccountInfo>();
  const [currentBalance, setCurrentBalance] = useState<DeriveBalancesAll>();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [fees, setFees] = useState<DeriveFees>();
  const [recipient, setRecipient] = useState('');
  const [recipientBalance, setRecipientBalance] = useState<DeriveBalancesAll>();
  const [sender, setSender] = useState('');
  const [validationResult, setValidationResult] = useState<
    Either<Errors, AllExtrinsicData>
  >(left({ fees: 'fetching fees...' }));

  const isRecipientValid = isAddressValid(api, recipient);

  // Subscribe to sender's & recipients's balances, nonce and some fees
  useEffect(() => {
    if (!isRecipientValid) {
      return;
    }

    setExtrinsic(api.tx.balances.transfer(recipient, amountAsString));

    const subscription = zip(
      api.derive.balances.fees(),
      api.derive.balances.votingBalance(sender),
      api.derive.balances.votingBalance(recipient),
      api.query.system.account(sender)
    )
      .pipe(take(1))
      .subscribe(([fees, currentBalance, recipientBalance, account]) => {
        setFees(fees);
        setCurrentBalance(currentBalance);
        setRecipientBalance(recipientBalance);
        setAccountNonce(account);
      });

    return (): void => subscription.unsubscribe();
  }, [amountAsString, api, isRecipientValid, recipient, sender]);

  useEffect(() => {
    const values = validate({
      amountAsString,
      accountNonce,
      currentBalance,
      extrinsic,
      fees,
      recipientBalance,
      recipientAddress: recipient,
      senderAddress: sender,
    });

    setValidationResult(values);
  }, [
    amountAsString,
    accountNonce,
    currentBalance,
    fees,
    recipientBalance,
    extrinsic,
    recipient,
    sender,
  ]);

  const handleSubmit = (): void => {
    validationResult.fold(
      (error) => {
        console.error(error);
      },
      () => {
        // If everything is correct, then submit the extrinsic
        window.alert('FIXME handleSubmit');
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
              onChangeAddress={setSender}
              type='accounts'
              value={sender}
            />
            <Balance address={sender} api={api} orientation='vertical' />
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
            <Input fluid onChange={handler(setRecipient)} value={recipient} />
            {isRecipientValid && (
              <Balance address={recipient} api={api} orientation='vertical' />
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
