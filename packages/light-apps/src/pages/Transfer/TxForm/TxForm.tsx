// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { handler, SystemContext } from '@substrate/context';
import { Header, Input, InputAddress, Stacked } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { AccountContext } from '../../../components/context';
import { assertIsDefined } from '../../../util/assert';
import { UserInput } from '../validate';

interface Props extends UserInput {
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
  setSender: React.Dispatch<React.SetStateAction<string>>;
  setTip: React.Dispatch<React.SetStateAction<string>>;
}

export function TxForm(props: Props): React.ReactElement {
  const {
    amount,
    recipient,
    sender,
    setAmount,
    setRecipient,
    setSender,
    setTip,
    tip,
  } = props;

  const { accounts } = useContext(AccountContext);
  const { properties } = useContext(SystemContext);

  assertIsDefined(properties, "We're inside SystemGate. qed.");

  // FIXME memoize this
  const accountsObj = [...accounts.entries()].reduce((acc, [key, value]) => {
    acc[key] = {
      json: { address: value.address, meta: value },
      option: {
        key: value.address,
        name: value.name || value.address,
        value: value.address,
      },
    };

    return acc;
  }, {} as SubjectInfo);

  return (
    <Stacked>
      <div className='items-start justify-start'>
        <Header as='h3' textAlign='left'>
          Amount:
        </Header>
        <Input
          fluid
          label={properties.tokenSymbol.unwrapOr('UNIT').toString()}
          labelPosition='right'
          min={0}
          onChange={handler(setAmount)}
          placeholder='e.g. 1.00'
          step='any'
          type='number'
          value={amount}
        />
      </div>

      <div className='items-start justify-start'>
        <Header as='h3'>Tip:</Header>
        <Input
          fluid
          label={properties.tokenSymbol.unwrapOr('UNIT').toString()}
          labelPosition='right'
          min={0}
          onChange={handler(setTip)}
          placeholder='e.g. 0.01'
          step='any'
          type='number'
          value={tip}
        />
      </div>

      <div className='items-start justify-start'>
        <Header as='h3'>Sender Account:</Header>
        <InputAddress
          accounts={accountsObj}
          onChangeAddress={setSender}
          type='accounts'
          value={sender}
        />
      </div>

      <div className='items-start justify-start'>
        <Header as='h3'>Recipient Address:</Header>
        <Input fluid onChange={handler(setRecipient)} value={recipient} />
      </div>
    </Stacked>
  );
}
