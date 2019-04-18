// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Subscribe } from '@substrate/ui-common';
import { map } from 'rxjs/operators';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { AddressSummary, Margin, Stacked, StackedHorizontal, WalletCard, WithSpace } from '@substrate/ui-components';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export class SavedAddresses extends React.PureComponent<Props> {
  render () {
    return (
      <WalletCard
        header='Saved Addresses'
        height='100%'
        overflow='scroll'
        subheader='Select an address to edit its metadata.'>
        <Stacked>
          <WithSpace>
            {this.renderAllAddressesFromKeyring()}
          </WithSpace>
        </Stacked>
      </WalletCard>
    );
  }

  renderAllAddressesFromKeyring () {
    const { match: { params: { currentAccount } } } = this.props;

    return (
      <Subscribe>
        {addressObservable.subject.pipe(
          map((allAddresses: SubjectInfo) =>
            !Object.keys(allAddresses).length
              ? <p> It looks like you haven't saved any addresses yet. </p>
              : Object.values(allAddresses).map((address: SingleAddress) =>
                <React.Fragment key={`__locked_${address.json.address}`}>
                  <Margin top />
                  <StackedHorizontal>
                    <Link to={`/addresses/${currentAccount}/${address.json.address}`}>
                      <AddressSummary
                        address={address.json.address}
                        name={address.json.meta.name}
                        orientation='horizontal'
                        size='small'
                      />
                    </Link>
                  </StackedHorizontal>
                </React.Fragment>
              )
          ))}
      </Subscribe>
    );
  }
}
