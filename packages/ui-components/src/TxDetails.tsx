// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SemanticShorthandItem } from 'semantic-ui-react';
import { AccordionPanelProps } from 'semantic-ui-react/dist/commonjs/modules/Accordion/AccordionPanel';

import { Accordion, AccordionProps, DEFAULT_TOKEN_SYMBOL, Header } from './';
import { Layout } from './Layout';

interface TxDetailsProps extends AccordionProps {
  allFees: BN;
  allTotal: BN;
  amount: BN;
  recipientAddress?: string;
  senderAddress: string;
  tokenSymbol?: string;
}

function panels({
  allFees,
  allTotal,
  amount,
  recipientAddress,
  senderAddress,
  tokenSymbol,
}: TxDetailsProps): SemanticShorthandItem<AccordionPanelProps>[] {
  const symbol = tokenSymbol || DEFAULT_TOKEN_SYMBOL;

  return [
    {
      key: 'details',
      title: {
        content: 'View details',
      },
      content: {
        content: (
          <Layout className='flex-column'>
            <Header as='h4'>Sender Account:</Header>
            <p>{senderAddress}</p>
            <Header as='h4'>Recipient Address:</Header>
            <p>{recipientAddress}</p>
            <Header as='h4'>Transfer Amount:</Header>
            <p>
              {amount.toString()} {symbol}
            </p>
            <Header as='h4'>Fees:</Header>
            <p>
              {allFees.toString()} {symbol}
            </p>
            <Header as='h4'>Total Amount (amount + fees):</Header>
            <p>
              {allTotal.toString()} {symbol}
            </p>
          </Layout>
        ),
      },
    },
  ];
}

export function TxDetails({
  allFees,
  allTotal,
  amount,
  recipientAddress,
  senderAddress,
  tokenSymbol,
  ...rest
}: TxDetailsProps): React.ReactElement {
  return (
    <Accordion
      panels={panels({
        allFees,
        allTotal,
        amount,
        recipientAddress,
        senderAddress,
        tokenSymbol,
      })}
      {...rest}
    />
  );
}
