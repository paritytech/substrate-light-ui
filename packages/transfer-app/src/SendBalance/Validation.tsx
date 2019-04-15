// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { DerivedBalances, DerivedFees } from '@polkadot/api-derive/types';
import { Index, Balance } from '@polkadot/types';
import { IExtrinsic } from '@polkadot/types/types';
import { MAX_SIZE_BYTES, MAX_SIZE_MB } from '@polkadot/ui-signer/Checks/constants';
import { compactToU8a, isFunction } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { ErrorText, Stacked, SubHeader } from '@substrate/ui-components';
import BN from 'bn.js';
import { Either } from 'fp-ts/lib/Either';
import React from 'react';
import { Observable, Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Form fields inputted by the user
 */
interface FormFields {
  amountAsString?: string;
  currentAccount: string;
  recipientAddress?: string;
}

/**
 * Results from api subscription (nonce, balance, fees)
 */
interface SubResults {
  accountNonce: Index;
  currentBalance: DerivedBalances;
  fees: DerivedFees;
  recipientBalance: DerivedBalances;
}

/**
 * Amount as Balance and Extrinsic
 */
interface AmountExtrinsic {
  amount: Balance;
  extrinsic: IExtrinsic;
}

/**
 * Derived fees and flags from subscription results
 */
interface Calculated {
  allFees: BN;
  allTotal: BN;
  hasAvailable: boolean;
  isRemovable: boolean;
  isReserved: boolean;
  overLimit: boolean;
}

interface Props extends FormFields {
  onValidExtrinsic?: (extrinsic: IExtrinsic) => void;
}

interface State extends Partial<SubResults> { }

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
    if (!this.props.recipientAddress) {
      return;
    }
    this.subscribeFees(this.props.currentAccount, this.props.recipientAddress);
  }

  componentDidUpdate (prevProps: Props) {
    if (!this.props.recipientAddress) {
      return;
    }

    if (
      prevProps.currentAccount !== this.props.currentAccount ||
      prevProps.recipientAddress !== this.props.recipientAddress
    ) {
      this.closeSubscription();
      this.subscribeFees(this.props.currentAccount, this.props.recipientAddress);
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
  calculateFees = (values: AmountExtrinsic & FormFields & SubResults): Calculated => {
    const { accountNonce, amount, currentBalance, extrinsic, fees } = values;

    const txLength = SIGNATURE_SIZE + compactToU8a(accountNonce).length + extrinsic.encodedLength;
    const allFees = fees.transactionBaseFee
      .add(fees.transactionByteFee.muln(txLength));
    const allTotal = amount.add(allFees);

    const hasAvailable = currentBalance.freeBalance.gte(allTotal);
    const isRemovable = currentBalance.votingBalance.sub(allTotal).lte(fees.existentialDeposit);
    const isReserved = currentBalance.freeBalance.isZero() && currentBalance.reservedBalance.gtn(0);
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

  getAmountFromString (amountAsString: string) {
    return new Balance(amountAsString);
  }

  subscribeFees (currentAccount: string, recipientAddress: string) {
    const { api } = this.context;

    // Subscribe to sender's & receivers's balances, nonce and some fees
    this.subscription = zip(
      api.derive.balances.fees() as unknown as Observable<DerivedFees>,
      api.derive.balances.votingBalance(currentAccount) as unknown as Observable<DerivedBalances>,
      api.derive.balances.votingBalance(recipientAddress) as unknown as Observable<DerivedBalances>,
      api.query.system.accountNonce(currentAccount) as unknown as Observable<Index>
    )
      .pipe(
        take(1)
      )
      .subscribe(([fees, currentBalance, recipientBalance, accountNonce]) => this.setState({
        fees,
        currentBalance,
        recipientBalance,
        accountNonce
      }));
  }

  /**
   * The order of validation is:
   * - validate user inputs
   * - create an `amount` BN, validate it
   * - validate that the subscription results are here
   * - create an extrinsic
   * - calculate derived stuff
   * - validate derived
   */
  validate (values: FormFields & State, api: ApiRx, onValidExtrinsic?: (extrinsic: IExtrinsic) => void) {
    const { accountNonce, amountAsString, currentAccount, currentBalance, fees, recipientAddress, recipientBalance } = values;

    const userInputErrors = this.validateUserInputs({ amountAsString, currentAccount, recipientAddress });
    if (Object.keys(userInputErrors).length > 0) {
      return userInputErrors;
    }

    const amount = this.getAmountFromString(amountAsString);

    if (amount.isNeg()) {
      return { amount: 'Please enter a positive amount to transfer.' };
    }

    if (amount.isZero()) {
      return { amount: 'Please make sure you are sending more than 0 balance.' };
    }

    const subResultsErrors = this.validateSubResults({ accountNonce, currentBalance, fees, recipientBalance });
    if (Object.keys(subResultsErrors).length > 0) {
      return subResultsErrors;
    }

    const extrinsic = api.tx.balances.transfer(recipientAddress, amount);

    const { hasAvailable, overLimit } = this.calculateFees({
      ...(values as FormFields & SubResults),
      amount,
      extrinsic
    });

    // See https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx
    if (!hasAvailable) {
      return { amount: 'The selected account does not have the required balance available for this transaction' };
    }
    if (overLimit) {
      return { amount: `This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB` };
    }

    // We now have a valid extrinsic, call callback
    if (isFunction(onValidExtrinsic)) {
      onValidExtrinsic(extrinsic);
    }

    return {};
  }

  validateSubResults (values: State) {
    const { accountNonce, currentBalance, fees, recipientBalance } = values;

    // Make sure the subscription results are here
    if (!accountNonce) {
      return { accountNonce: 'Please wait while we fetch your account nonce.' };
    }

    if (!fees) {
      return { fees: 'Please wait while we fetch transfer fees.' };
    }

    if (!currentBalance) {
      return { currentBalance: 'Please wait while we fetch your voting balance.' };
    }

    if (!recipientBalance) {
      return { recipientBalance: "Please wait while we fetch the recipient's balance." };
    }

    return {};
  }

  validateUserInputs (values: FormFields) {
    const { amountAsString, currentAccount, recipientAddress } = values;

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

  warnings (values: AmountExtrinsic & FormFields & State) {
    const { accountNonce, amount, currentBalance, fees, recipientBalance } = values;

    // Make sure we have sub results already
    const subResultsErrors = this.validateSubResults({ accountNonce, currentBalance, fees, recipientBalance });
    if (Object.keys(subResultsErrors).length > 0) {
      return {};
    }

    // Adding !s here because we already checked the values are defined just before
    const isCreation = recipientBalance!.votingBalance.isZero() && fees!.creationFee.gtn(0);
    const isNoEffect = amount.add(recipientBalance!.votingBalance).lte(fees!.existentialDeposit);
  }

  render () {
    const { api } = this.context;

    // For now we assume there'll just be 1 error. We could in the future show
    // multiple errors at the same time.
    const error = Object.values(this.validate({
      ...this.props,
      ...this.state
    }, api))[0];

    // FIXME we're calling some functions twice ()

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
