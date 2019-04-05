// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { AddressSummary, BalanceDisplay, Margin, Stacked, StackedHorizontal, WalletCard, WithSpace } from '@substrate/ui-components';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { AppContext, Subscribe } from '@substrate/ui-common';
import { map } from 'rxjs/operators';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { MatchParams } from './types';

interface Props extends RouteComponentProps<MatchParams> { }

export class SavedAddresses extends React.PureComponent<Props> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  render () {
    return (
      <WalletCard
        header='Saved Addresses'
        height='100%'
        overflow='scroll'
        subheader='select saved addresses to edit meta.'>
        <Stacked>
          <WithSpace>
            {this.renderAllAddressesFromKeyring()}
          </WithSpace>
        </Stacked>
      </WalletCard>
    );
  }

  renderAllAddressesFromKeyring () {
    const { api } = this.context;
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <Subscribe>
        {addressObservable.subject.pipe(
          map((allAddresses: SubjectInfo) =>
            !Object.keys(allAddresses).length
              ? <p> Emptiness </p>
              : Object.values(allAddresses).map((address: SingleAddress) =>
                <React.Fragment key={`__locked_${address.json.address}`}>
                  <Margin top />
                  <StackedHorizontal>
                    <Link to={{
                      pathname: `/identity/${currentAccount}`,
                      state: {
                        editing: address.json.address
                      }
                    }}>
                      <AddressSummary
                        address={address.json.address}
                        data-address={address.json.address} // Trick to avoid creating a new React component
                        name={address.json.meta.name}
                        orientation='horizontal'
                        size='small' />
                    </Link>
                    <Subscribe>
                      {
                        // FIXME using any because freeBalance gives a Codec here, not a Balance
                        // Wait for @polkadot/api to have TS support for all query.*
                        api.query.balances.freeBalance(address.json.address).pipe(map(this.renderBalance as any))
                      }
                    </Subscribe>
                  </StackedHorizontal>
                </React.Fragment>
              )
          ))}
      </Subscribe>
    );
  }

  renderBalance = (balance: Balance) => {
    return <BalanceDisplay balance={balance} />;
  }
}
