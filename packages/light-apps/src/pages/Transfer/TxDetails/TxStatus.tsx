import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import React from 'react';

export type TxStatus =
  | 'empty' // Still needs inputs from user
  | 'validating' // Frontend is validating user input
  | 'validated' // Frontend has validated user input
  | 'sending' // User clicked on submit
  | ExtrinsicStatus;

interface Props {
  txStatus: TxStatus;
}

export function TxStatusText(props: Props): React.ReactElement {
  const { txStatus } = props;

  return <p>[dev] TX STATUS: {txStatus.toString()}</p>;
}
