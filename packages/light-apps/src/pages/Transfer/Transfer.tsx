// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SigningRequest } from '@polkadot/extension-base/background/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { ApiRxContext } from '@substrate/context';
import { Form, Header, Layout, Paragraph } from '@substrate/ui-components';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { InjectedContext } from '../../components/context';
import { assertIsDefined } from '../../util/assert';
import { TxDetails, TxStatus, TxStatusText } from './TxDetails';
import { TxForm } from './TxForm';
import { validate } from './validate';

export function Transfer(): React.ReactElement {
  const { api } = useContext(ApiRxContext);
  const { messaging } = useContext(InjectedContext);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [tip, setTip] = useState('');

  const [password, setPassword] = useState('');

  const [txStatus, setTxStatus] = useState<TxStatus>('empty');
  const [error, setError] = useState('');

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

      // Create the extrinsic, ready to be signed
      api.tx.balances
        .transfer(recipient, amount)
        .signAndSend(sender, {
          tip,
        })
        .subscribe(
          ({ status }) => {
            setTxStatus(status);
          },
          (error) => {
            // Will be caught be the transfer().catch() block
            throw error;
          }
        );
      assertIsDefined(
        messaging,
        "We wouldn't be sending from this account if there was no injected messaging. qed."
      );
      // We just created a signing request with `api.tx.balances.transfer`, it
      // should show up here
      const request: SigningRequest = await new Promise((resolve) => {
        messaging.subscribeSigningRequests((requests) => {
          if (!requests.length) {
            return;
          }

          resolve(requests[0]);
        });
      });
      // Finally, we sign the above request with the password the user inputted
      // FIXME Cater for wrong password
      await messaging.approveSignPassword(request.id, password);
    }

    transfer().catch((error) => {
      // Fallback to `validated` status if there's an error
      setTxStatus('validated');
      setError(error.message);
    });
  }, [amount, api, messaging, password, recipient, sender, tip]);

  return (
    <Layout className='flex-column items-stretch w-100 mw7 pt4'>
      <Header>Send Funds</Header>
      <Form onSubmit={handleSubmit}>
        <Paragraph status='error'>{error}</Paragraph>
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
            password={password}
            recipient={recipient}
            sender={sender}
            setPassword={setPassword}
            tip={tip}
            txStatus={txStatus}
          />
        )}
        <TxStatusText txStatus={txStatus} />
      </Form>
    </Layout>
  );
}
