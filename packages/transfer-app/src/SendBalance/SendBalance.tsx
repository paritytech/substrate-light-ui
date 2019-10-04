// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types/interfaces';
import { AppContext, handler, TxQueueContext, validate, AllExtrinsicData } from '@substrate/ui-common';
import { Balance, Form, Input, NavButton, Stacked, SubHeader, WrapperDiv, WithSpaceAround } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { zip } from 'rxjs';
import { take } from 'rxjs/operators';

import { InputAddress } from '../Transfer.styles';
import { Validation } from './Validation';

interface Props {
  currentAccount: string;
  recipientAddress: string;
}

export function SendBalance (props: Props) {
  const { api, keyring } = useContext(AppContext);
  const { enqueue } = useContext(TxQueueContext);

  const { currentAccount, recipientAddress } = props;

  const [amountAsString, setAmountAsString] = useState('');
  const [accountNonce, setAccountNonce] = useState();
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [currentBalance, setCurrentBalance] = useState();
  const [fees, setFees] = useState();
  const [recipientBalance, setRecipientBalance] = useState();

  const extrinsic = api.tx.balances.transfer(recipientAddress, amountAsString);
  const values = validate({ amountAsString, accountNonce, currentBalance, extrinsic, fees, recipientBalance, currentAccount, recipientAddress }, api);

  // Subscribe to sender's & receivers's balances, nonce and some fees
  useEffect(() => {
    if (!recipientAddress) {
      return;
    }

    setSender(currentAccount);
    setReceiver(recipientAddress);

    const subscription = zip(
      api.derive.balances.fees<DerivedFees>(),
      api.derive.balances.votingBalance<DerivedBalances>(currentAccount),
      api.derive.balances.votingBalance<DerivedBalances>(recipientAddress),
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

  const changeCurrentAccount = (newCurrentAccount: string) => {
    setSender(newCurrentAccount);
  };

  const changeRecipientAddress = (newRecipientAddress: string) => {
    setReceiver(newRecipientAddress);
  };

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
    <WrapperDiv>
      <Form onSubmit={handleSubmit}>
        <Stacked justifyContent='flex-start'>
          <WrapperDiv>
            <SubHeader textAlign='left'>Sender Account:</SubHeader>
            <InputAddress
              isDisabled
              onChange={changeCurrentAccount}
              type='account'
              value={sender}
              withLabel={false}
            />
            <Balance address={currentAccount} />
          </WrapperDiv>

          <WrapperDiv>
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
          </WrapperDiv>

          <WrapperDiv>
            <SubHeader textAlign='left'>Recipient Address:</SubHeader>
            <InputAddress
              label={undefined}
              onChange={changeRecipientAddress}
              type='all'
              value={receiver}
              withLabel={false}
            />
            {recipientAddress && <Balance address={recipientAddress} />}
          </WrapperDiv>
          <WithSpaceAround>
            <Validation values={values} />
          </WithSpaceAround>
          <NavButton disabled={values.isLeft()}>Submit</NavButton>
        </Stacked>
      </Form>
    </WrapperDiv>
  );
}
