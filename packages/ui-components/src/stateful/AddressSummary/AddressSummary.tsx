// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import React from 'react';

import { Balance } from '../Balance';
import { Margin } from '../../Margin';
import { DynamicSizeText, Stacked, StackedHorizontal } from '../../Shared.styles';
import { OrientationType, SizeType } from './types';
import { FontSize } from '../../types';

type AddressSummaryProps = {
  address?: string,
  detailed?: boolean,
  name?: string,
  noBalance?: boolean,
  orientation?: OrientationType,
  showAllBalances?: boolean,
  size?: SizeType
};

const PLACEHOLDER_NAME = 'No Name';
const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export function AddressSummary (props: AddressSummaryProps) {
  const {
    address = PLACEHOLDER_ADDRESS,
    name = PLACEHOLDER_NAME,
    noBalance = false,
    orientation = 'vertical',
    detailed = false,
    size = 'medium'
  } = props;

  return orientation === 'vertical'
    ? (
      <Stacked>
        {renderIcon(address, size)}
        {renderDetails(address, detailed, name, noBalance, size)}
      </Stacked>
    )
    : (
      <StackedHorizontal justifyContent='space-around'>
        {renderIcon(address, size)}
        <Margin left />
        <Stacked>
          {renderDetails(address, detailed, name, noBalance, size)}
        </Stacked>
      </StackedHorizontal>
    );
}

const ICON_SIZES = {
  tiny: 16,
  small: 32,
  medium: 64,
  large: 128
};

function renderIcon (address: string, size: SizeType) {
  return <IdentityIcon value={address} theme={'substrate'} size={ICON_SIZES[size]} />;
}

const FONT_SIZES = {
  tiny: 'small',
  small: 'medium',
  medium: 'large',
  large: 'big'
};

function renderDetails (address: string, detailed: boolean, name: string, noBalance: boolean, size: SizeType) {
  return (
    <React.Fragment>
      <DynamicSizeText fontSize={FONT_SIZES[size] as FontSize}> {name} </DynamicSizeText>
      {!noBalance && <Balance address={address} detailed={detailed} fontSize={FONT_SIZES[size] as FontSize} />}
    </React.Fragment>
  );
}
