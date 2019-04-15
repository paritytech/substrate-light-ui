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
import { ErrorText, List, Stacked, SubHeader } from '@substrate/ui-components';
import BN from 'bn.js';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromEither, none, some } from 'fp-ts/lib/Option';
import React from 'react';
import { Observable, Subscription, zip } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Form fields inputted by the user
 */
interface UserInputs {
  amountAsString: string;
  currentAccount: string;
  recipientAddress: string;
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
 * Amount as Balance
 */
interface WithAmount {
  amount: Balance;
}

/**
 * Extrinsic
 */
interface WithExtrinsic {
  extrinsic: IExtrinsic;
}

/**
 * Amount as Balance and Extrinsic
 */
type WithAmountExtrinsic = WithAmount & WithExtrinsic;

/**
 * Derived fees and flags from subscription results and user inputs
 */
interface WithDerived {
  allFees: BN;
  allTotal: BN;
  hasAvailable: boolean;
  isCreation: boolean;
  isNoEffect: boolean;
  isRemovable: boolean;
  isReserved: boolean;
  overLimit: boolean;
}

type Errors = Partial<Record<keyof (SubResults & UserInputs & WithAmountExtrinsic), string>>;

type WithEverything = SubResults & UserInputs & WithAmountExtrinsic & WithDerived;

interface Props extends Partial<UserInputs> {
  currentAccount: string; // This one will be always set, overriding the partial
  onValidExtrinsic?: (values: WithEverything) => void;
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
   * Validate everything. The order of validation should be easily readable
   * from the `.chain()` syntax.
   */
  validate (
    values: Partial<UserInputs & SubResults>,
    api: ApiRx,
    onValidExtrinsic?: (extrinsic: WithEverything) => void
  ): Either<Errors, WithEverything> {

    return this
      .validateUserInputs(values)
      .chain(this.validateSubResults)
      .chain(this.validateAmount)
      .chain(this.withExtrinsic(api))
      .chain(this.validateDerived)
      .map((values) => {
        // Side-effect: call callback if available
        isFunction(onValidExtrinsic) && onValidExtrinsic(values);
        return values;
      });
  }

  /**
   * Make sure the amount (as a BN) is correct.
   */
  validateAmount (values: SubResults & UserInputs): Either<Errors, SubResults & UserInputs & WithAmount> {
    const { amountAsString, ...rest } = values;
    const amount = new Balance(amountAsString);

    if (amount.isNeg()) {
      return left({ amount: 'Please enter a positive amount to transfer.' });
    }

    if (amount.isZero()) {
      return left({ amount: 'Please make sure you are sending more than 0 balance.' });
    }

    return right({ amount, ...rest } as SubResults & UserInputs & WithAmount);
  }

  /**
   * Make sure derived validations (fees, minimal amount) are correct.
   * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
   */
  validateDerived = (values: SubResults & UserInputs & WithAmountExtrinsic): Either<Errors, WithEverything> => {
    const { accountNonce, amount, currentBalance, extrinsic, fees, recipientBalance } = values;

    const txLength = SIGNATURE_SIZE + compactToU8a(accountNonce).length + extrinsic.encodedLength;
    const allFees = fees.transactionBaseFee.add(fees.transactionByteFee.muln(txLength));

    const isCreation = recipientBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
    const isNoEffect = amount.add(recipientBalance.votingBalance).lte(fees.existentialDeposit);

    const allTotal = amount.add(allFees).add(isCreation ? fees.creationFee : new BN(0));

    const hasAvailable = currentBalance.freeBalance.gte(allTotal);
    const isRemovable = currentBalance.votingBalance.sub(allTotal).lte(fees.existentialDeposit);
    const isReserved = currentBalance.freeBalance.isZero() && currentBalance.reservedBalance.gtn(0);
    const overLimit = txLength >= MAX_SIZE_BYTES;

    if (!hasAvailable) {
      return left({ amount: 'The selected account does not have the required balance available for this transaction.' });
    }
    if (overLimit) {
      return left({ amount: `This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB.` });
    }

    return right({
      ...values,
      allFees,
      allTotal,
      hasAvailable,
      isCreation,
      isNoEffect,
      isRemovable,
      isReserved,
      overLimit
    });
  }

  /**
   * Make sure the subscription results are here.
   */
  validateSubResults (values: Partial<SubResults & UserInputs>): Either<Errors, SubResults & UserInputs> {
    const { accountNonce, currentBalance, fees, recipientBalance, ...rest } = values;

    if (!accountNonce) {
      return left({ accountNonce: 'Please wait while we fetch your account nonce.' });
    }

    if (!fees) {
      return left({ fees: 'Please wait while we fetch transfer fees.' });
    }

    if (!currentBalance) {
      return left({ currentBalance: 'Please wait while we fetch your voting balance.' });
    }

    if (!recipientBalance) {
      return left({ recipientBalance: "Please wait while we fetch the recipient's balance." });
    }

    return right({ accountNonce, currentBalance, fees, recipientBalance, ...rest } as SubResults & UserInputs);
  }

  /**
   * Make sure everything the user inputted is correct.
   */
  validateUserInputs (values: Partial<SubResults & UserInputs>): Either<Errors, Partial<SubResults> & UserInputs> {
    const { amountAsString, currentAccount, recipientAddress, ...rest } = values;

    if (!currentAccount) {
      return left({ currentAccount: 'Please enter a sender account.' });
    }
    if (!recipientAddress) {
      return left({ recipientAddress: 'Please enter a recipient address.' });
    }
    if (currentAccount === recipientAddress) {
      return left({ currentAccount: 'You cannot send balance to yourself.' });
    }

    if (!amountAsString) {
      return left({ amount: 'Please enter an amount' });
    }

    return right({ amountAsString, currentAccount, recipientAddress, ...rest } as Partial<SubResults> & UserInputs);
  }

  /**
   * Show some warnings, that are not blocking the transaction, but may have
   * undesirable effects for the user.
   * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L158-L168
   */
  warnings (values: WithEverything) {
    const { fees, hasAvailable, isCreation, isNoEffect, isRemovable, isReserved } = values;

    const warnings = [];

    if (isRemovable && hasAvailable) {
      warnings.push('Submitting this transaction will drop the account balance to below the existential amount, which can result in the account being removed from the chain state associated funds burned.');
    }

    if (isNoEffect) {
      warnings.push('The final recipient balance is less than the existential amount and will not be reflected.');
    }

    if (isCreation) {
      warnings.push(`A fee of ${fees.creationFee} will be deducted from the sender since the destination account does not exist.`);
    }

    if (isReserved) {
      warnings.push('This account does have a reserved/locked balance, not taken into account');
    }

    return warnings.length > 0 ? some(warnings) : none;
  }

  /**
   * Add the extrinsic object, no validation done here
   */
  withExtrinsic (api: ApiRx) {
    return function (values: SubResults & UserInputs & WithAmount): Either<Errors, SubResults & UserInputs & WithAmountExtrinsic> {
      const { amount, recipientAddress } = values;
      const extrinsic = api.tx.balances.transfer(recipientAddress, amount);

      return right({ ...values, extrinsic } as SubResults & UserInputs & WithAmountExtrinsic);
    };
  }

  render () {
    const { api } = this.context;
    const { onValidExtrinsic } = this.props;

    const validations = this.validate(
      { ...this.props, ...this.state },
      api,
      onValidExtrinsic
    );

    const warnings = fromEither(validations).chain(this.warnings);

    return (
      <Stacked>
        {validations.fold(this.renderErrors, this.renderNull)}
        {warnings.fold(null, this.renderWarnings)}
      </Stacked>
    );
  }

  renderErrors (errors: Errors) {
    // For now we assume there's only one error, and show it. It should be
    // relatively easy to extend to show multiple errors.
    const error = Object.values(errors)[0];

    return (
      <React.Fragment>
        <SubHeader>Errors</SubHeader>
        <ErrorText>
          {error}
        </ErrorText>
      </React.Fragment>
    );
  }

  renderNull () {
    return null;
  }

  renderWarnings (warnings: string[]) {
    return (
      <React.Fragment>
        <SubHeader>Warnings</SubHeader>
        <List>
          {warnings.map((warning) => <List.Item key={warning}>{warning}</List.Item>)}
        </List>
      </React.Fragment>
    );
  }
}
