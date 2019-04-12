// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index, Balance } from '@polkadot/types';
import { IExtrinsic } from '@polkadot/types/types';
import { MAX_SIZE_BYTES, MAX_SIZE_MB } from '@polkadot/ui-signer/Checks/constants';
import { compactToU8a } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { ErrorText, Stacked, SubHeader } from '@substrate/ui-components';
import BN from 'bn.js';
import React from 'react';
import { Observable, Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

interface Props {
  amountAsString?: string;
  currentAccount: string;
  extrinsic?: IExtrinsic;
  recipientAddress?: string;
}

interface State {
  fees?: DerivedFees;
  votingBalance?: DerivedBalances;
  accountNonce?: Index;
}

interface Calculated {
  allFees: BN;
  allTotal: BN;
  hasAvailable: boolean;
  isRemovable: boolean;
  isReserved: boolean;
  overLimit: boolean;

}

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

export class Validation extends React.Component<Props, State> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  state: State = {};

  subscription?: Subscription;

  componentDidMount () {
    this.subscribeFees(this.props.currentAccount);
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.currentAccount !== this.props.currentAccount) {
      this.closeSubscription();
      this.subscribeFees(this.props.currentAccount);
    }
  }

  componentWillUnmount () {
    this.closeSubscription();
  }

  closeSubscription () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  /**
   * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
   */
  calculateAllFees = (
    amount: Balance,
    extrinsic: IExtrinsic,
    fees: DerivedFees,
    votingBalance: DerivedBalances,
    accountNonce: Index
  ): Calculated => {

    const txLength = SIGNATURE_SIZE + compactToU8a(accountNonce).length + extrinsic.encodedLength;
    const allFees = fees.transactionBaseFee
      .add(fees.transactionByteFee.muln(txLength));
    const allTotal = amount.add(allFees);

    const hasAvailable = votingBalance.freeBalance.gte(allFees);
    const isRemovable = votingBalance.votingBalance.sub(allFees).lte(fees.existentialDeposit);
    const isReserved = votingBalance.freeBalance.isZero() && votingBalance.reservedBalance.gtn(0);
    const overLimit = txLength >= MAX_SIZE_BYTES;

    return {
      allFees,
      allTotal,
      hasAvailable,
      isRemovable,
      isReserved,
      overLimit
    };
  }

  subscribeFees (currentAccount: string) {
    const { api } = this.context;

    // Subscribe to sender's balances, nonce and some fees
    zip(
      api.derive.balances.fees() as unknown as Observable<DerivedFees>,
      api.derive.balances.votingBalance(currentAccount) as unknown as Observable<DerivedBalances>,
      api.query.system.accountNonce(currentAccount) as unknown as Observable<Index>
    )
      .pipe(
        take(1)
      )
      .subscribe(([fees, votingBalance, accountNonce]) => this.setState({
        fees,
        votingBalance,
        accountNonce
      }));
  }

  prevalidate (currentAccount: string, recipientAddress?: string, amountAsString?: string) {
    // Do validation on account/address
    if (!currentAccount) {
      return { currentAccount: 'Please enter a sender account.' };
    }
    if (!currentAccount) {
      return { currentAccount: 'Please enter a recipient address.' };
    }
    if (currentAccount === recipientAddress) {
      return { currentAccount: 'You cannot send balance to yourself.' };
    }

    if (!amountAsString) {
      return { amount: 'Please enter an amount' };
    }

    return {};
  }

  validate () {
    const { api } = this.context;
    const { amountAsString, currentAccount, recipientAddress } = this.props;
    const { accountNonce, fees, votingBalance } = this.state;

    const prevalidateErrors = this.prevalidate(currentAccount, recipientAddress, amountAsString);

    if (Object.keys(prevalidateErrors).length > 0) {
      return prevalidateErrors;
    }

    const amount = new Balance(amountAsString);

    if (amount.isNeg()) {
      return { amount: 'Please enter a positive amount to transfer.' };
    }

    if (amount.isZero()) {
      return { amount: 'Please make sure you are sending more than 0 balance.' };
    }

    // Make sure the subscription results are here
    // TODO: Improve UX here
    if (!accountNonce) {
      return { accountNonce: 'Please wait while we fetch your account nonce.' };
    }

    if (!fees) {
      return { fees: 'Please wait while we fetch transfer fees.' };
    }

    if (!votingBalance) {
      return { votingBalance: 'Please wait while we fetch your voting balance.' };
    }

    const extrinsic = api.tx.balances.transfer(recipientAddress, amount);

    const {
      allFees,
      allTotal,
      hasAvailable,
      isRemovable,
      isReserved,
      overLimit
    } = this.calculateAllFees(
      amount,
      extrinsic,
      fees,
      votingBalance,
      accountNonce
    );

    // See https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx
    if (!hasAvailable) {
      return { amount: 'The selected account does not have the required balance available for this transaction' };
    }
    if (overLimit) {
      return { amount: `This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB` };
    }

    return {};

  }

  render () {
    const error = Object.values(this.validate())[0];
    if (!error) {
      return null;
    }

    return (
      <Stacked>
        <SubHeader>Errors</SubHeader>
        <ErrorText>
          {error}
        </ErrorText>
      </Stacked>
    );
  }
}
