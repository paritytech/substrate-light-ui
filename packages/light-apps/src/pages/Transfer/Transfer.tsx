// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3FromAddress } from '@polkadot/extension-dapp';
import { ApiContext } from '@substrate/context';
import { ErrorText, Form, Header, WrapperDiv } from '@substrate/ui-components';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { TxDetails, TxStatus, TxStatusText } from './TxDetails';
import { TxForm } from './TxForm';
import { validate } from './validate';

export function Transfer(): React.ReactElement {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [tip, setTip] = useState('');

  const [txStatus, setTxStatus] = useState<TxStatus>('empty');
  const [error, setError] = useState('');

  const { api } = useContext(ApiContext);

  // Form validation effect
  useEffect(() => {
    setTxStatus('validating');

    if (!amount && !recipient && !sender && !tip) {
      return;
    }

    validate({ amount, recipient, sender, tip }, api).subscribe(
      () => {
        setTxStatus('validated');
      },
      (error) => {
        setTxStatus('empty');
        setError(error.message);
      }
    );
  }, [amount, api, recipient, sender, tip]);

  // Form submission handle
  const handleSubmit = useCallback(() => {
    async function transfer(): Promise<void> {
      setTxStatus('sending');
      const injector = await web3FromAddress(sender);
      api.setSigner(injector.signer);

      api.tx.balances.transfer(recipient, amount).signAndSend(
        sender,
        {
          tip,
        },
        ({ status }) => {
          setTxStatus(status);
        }
      );
    }

    transfer().catch((error) => {
      // Fallback to `validated` status if there's an error
      setTxStatus('validated');
      setError(error.message);
    });
  }, [amount, api, recipient, sender, tip]);

  return (
    <WrapperDiv>
      <Header>Send Funds</Header>
      <Form onSubmit={handleSubmit}>
        <ErrorText>{error}</ErrorText>
        <TxForm
          amount={amount}
          recipient={recipient}
          sender={sender}
          setAmount={setAmount}
          setRecipient={setRecipient}
          setSender={setSender}
          setTip={setTip}
          tip={tip}
        />
        {txStatus !== 'empty' && txStatus !== 'validating' && (
          <TxDetails
            amount={amount}
            recipient={recipient}
            sender={sender}
            tip={tip}
            txStatus={txStatus}
          />
        )}
        <TxStatusText txStatus={txStatus} />
      </Form>
    </WrapperDiv>
  );
}
