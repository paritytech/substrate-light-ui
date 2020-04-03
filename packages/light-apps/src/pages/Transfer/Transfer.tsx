// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/context';
import { ErrorText, Form, Header, WrapperDiv } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { TxDetails } from './TxDetails';
import { TxForm } from './TxForm';
import { validate } from './validate';

export function Transfer(): React.ReactElement {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [tip, setTip] = useState('');

  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  const { api } = useContext(ApiContext);

  // Form validation effect
  useEffect(() => {
    setShowDetails(false);

    if (!amount && !recipient && !sender && !tip) {
      return;
    }

    validate({ amount, recipient, sender, tip }, api).subscribe(
      () => setShowDetails(true),
      (error) => setError(error.message)
    );
  }, [amount, api, recipient, sender, tip]);

  return (
    <WrapperDiv>
      <Header>Send Funds</Header>
      <Form>
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
        {showDetails && (
          <TxDetails
            amount={amount}
            recipient={recipient}
            sender={sender}
            tip={tip}
          />
        )}
      </Form>
    </WrapperDiv>
  );
}
