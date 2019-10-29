// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SemanticShorthandItem } from 'semantic-ui-react';
import { AccordionPanelProps } from 'semantic-ui-react/dist/commonjs/modules/Accordion/AccordionPanel';

import { Accordion, AccordionProps, DEFAULT_TOKEN_SYMBOL, Stacked, SubHeader } from './';

interface TxDetailsProps extends AccordionProps {
  allFees: BN;
  allTotal: BN;
  amount: BN;
  recipientAddress?: string;
  senderAddress: string;
  tokenSymbol?: string;
}

function panels ({ allFees, allTotal, amount, recipientAddress, senderAddress, tokenSymbol }: TxDetailsProps): SemanticShorthandItem<AccordionPanelProps>[] {
  const symbol = tokenSymbol || DEFAULT_TOKEN_SYMBOL;

  return [{
    key: 'details',
    title: {
      content: 'View details'
    },
    content: {
      content: <Stacked alignItems='flex-start'>
        <SubHeader noMargin>Sender Account:</SubHeader>
        <p>{senderAddress}</p>
        <SubHeader noMargin>Recipient Address:</SubHeader>
        <p>{recipientAddress}</p>
        <SubHeader noMargin>Transfer Amount:</SubHeader>
        <p>{amount.toString()} {symbol}</p>
        <SubHeader noMargin>Fees:</SubHeader>
        <p>{allFees.toString()} {symbol}</p>
        <SubHeader noMargin>Total Amount (amount + fees):</SubHeader>
        <p>{allTotal.toString()} {symbol}</p>
      </Stacked>
    }
  }];
}

export function TxDetails ({ allFees, allTotal, amount, recipientAddress, senderAddress, tokenSymbol, ...rest }: TxDetailsProps): React.ReactElement {
  return (
    <Accordion panels={panels({ allFees, allTotal, amount, recipientAddress, senderAddress, tokenSymbol })} {...rest} />
  );
}
