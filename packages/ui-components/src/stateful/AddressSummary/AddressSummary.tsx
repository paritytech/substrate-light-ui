// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import IdentityIcon from '@polkadot/react-identicon';
import React from 'react';

import { Header, Layout, Margin, Paragraph } from '../../index';
import { Balance } from '../Balance';
import { OrientationType, SizeType } from './types';

type AddressSummaryProps = {
  address?: string; // TODO support AccountId
  api: ApiRx;
  bondingPair?: string; // TODO support AccountId
  detailed?: boolean;
  isNominator?: boolean;
  isValidator?: boolean;
  name?: string;
  noPlaceholderName?: boolean;
  noBalance?: boolean;
  orientation?: OrientationType;
  type?: 'stash' | 'controller';
  size?: SizeType;
  withShortAddress?: boolean;
};

const PLACEHOLDER_NAME = 'No Name';

const ICON_SIZES = {
  tiny: 16,
  small: 32,
  medium: 96,
  large: 128,
};

function renderIcon(address: string, size: SizeType): React.ReactElement {
  return (
    <IdentityIcon value={address} theme={'substrate'} size={ICON_SIZES[size]} />
  );
}

function renderAccountType(type: string): React.ReactElement {
  return <Paragraph faded> Account Type: {type} </Paragraph>;
}

function renderBadge(type: string): React.ReactElement {
  // FIXME make it an actual badge
  return type === 'nominator' ? (
    <Header as='h4'>nominator</Header>
  ) : (
    <Header as='h4'>validator</Header>
  );
}

function renderBondingPair(bondingPair: string): React.ReactElement {
  return (
    <Layout>
      <Paragraph faded> Bonding Pair: </Paragraph>
      {renderIcon(bondingPair, 'tiny')}
    </Layout>
  );
}

function renderShortAddress(address: string): string {
  return address
    .slice(0, 8)
    .concat('......')
    .concat(address.slice(address.length - 8, address.length));
}

function renderDetails(
  address: string,
  api: ApiRx,
  summaryProps: Exclude<AddressSummaryProps, keyof 'address'>
): React.ReactElement {
  const {
    bondingPair,
    detailed,
    isNominator,
    isValidator,
    name = PLACEHOLDER_NAME,
    noBalance,
    noPlaceholderName,
    orientation,
    type,
    withShortAddress,
  } = summaryProps;

  return (
    <>
      <Layout className='flex-column items-start'>
        <Paragraph>{noPlaceholderName ? null : name} </Paragraph>
        {withShortAddress && renderShortAddress(address)}
        {type && renderAccountType(type)}
      </Layout>
      <Layout className='flex-column items-start'>
        {bondingPair && renderBondingPair(bondingPair)}
        {isNominator && renderBadge('nominator')}
        {isValidator && renderBadge('validator')}
        {!noBalance && (
          <Balance
            address={address}
            api={api}
            detailed={detailed}
            orientation={orientation}
          />
        )}
      </Layout>
    </>
  );
}

export function AddressSummary(props: AddressSummaryProps): React.ReactElement {
  const { address, api, orientation = 'vertical', size = 'medium' } = props;

  return address ? (
    orientation === 'vertical' ? (
      <Layout className='flex-column'>
        {renderIcon(address, size)}
        {renderDetails(address, api, props)}
      </Layout>
    ) : (
      <Layout>
        {renderIcon(address, size)}
        <Margin left />
        {renderDetails(address, api, props)}
      </Layout>
    )
  ) : (
    <div>No Address Provided</div>
  );
}
