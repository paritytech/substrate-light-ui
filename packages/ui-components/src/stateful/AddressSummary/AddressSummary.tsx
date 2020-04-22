// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import IdentityIcon from '@polkadot/react-identicon';
import React from 'react';

import { Header } from '../../Header';
import { Margin } from '../../Margin';
import { Paragraph } from '../../Paragraph';
import { Stacked, StackedHorizontal } from '../../Shared.styles';
import { FlexAlign, FlexJustify } from '../../types';
import { Balance } from '../Balance';
import { OrientationType, SizeType } from './types';

type AddressSummaryProps = {
  address?: string; // TODO support AccountId
  alignItems?: FlexAlign;
  api: ApiRx;
  bondingPair?: string; // TODO support AccountId
  detailed?: boolean;
  isNominator?: boolean;
  isValidator?: boolean;
  justifyContent?: FlexJustify;
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
    <StackedHorizontal>
      <Paragraph faded> Bonding Pair: </Paragraph>
      {renderIcon(bondingPair, 'tiny')}
    </StackedHorizontal>
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
      <Stacked alignItems='flex-start'>
        <Paragraph>{noPlaceholderName ? null : name} </Paragraph>
        {withShortAddress && renderShortAddress(address)}
        {type && renderAccountType(type)}
      </Stacked>
      <Stacked alignItems='flex-start'>
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
      </Stacked>
    </>
  );
}

export function AddressSummary(props: AddressSummaryProps): React.ReactElement {
  const {
    address,
    api,
    alignItems = 'center',
    justifyContent = 'flex-start',
    orientation = 'vertical',
    size = 'medium',
  } = props;

  return address ? (
    orientation === 'vertical' ? (
      <Stacked justifyContent={justifyContent}>
        {renderIcon(address, size)}
        {renderDetails(address, api, props)}
      </Stacked>
    ) : (
      <StackedHorizontal
        alignItems={alignItems}
        justifyContent={justifyContent}
      >
        {renderIcon(address, size)}
        <Margin left />
        {renderDetails(address, api, props)}
      </StackedHorizontal>
    )
  ) : (
    <div>No Address Provided</div>
  );
}
