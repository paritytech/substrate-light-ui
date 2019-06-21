// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/ui-identicon';
import { fromNullable } from 'fp-ts/lib/Option'
import React from 'react';

import { Balance } from '../Balance';
import { Margin } from '../../Margin';
import { DynamicSizeText, SubHeader, Stacked, StackedHorizontal } from '../../Shared.styles';
import { OrientationType, SizeType } from './types';
import { FlexJustify, FontSize } from '../../types';

type AddressSummaryProps = {
  address?: string,
  detailed?: boolean,
  isNominator?: boolean,
  isValidator?: boolean,
  justifyContent?: FlexJustify,
  name?: string,
  noBalance?: boolean,
  orientation?: OrientationType,
  size?: SizeType
};

const PLACEHOLDER_NAME = 'No Name';

export function AddressSummary (props: AddressSummaryProps) {
  const {
    address,
    isNominator = false,
    isValidator = false,
    justifyContent = 'space-around',
    orientation = 'vertical',
    size = 'medium'
  } = props;

  return fromNullable(address)
    .map((address: string) => {
      return orientation === 'vertical'
          ? (
            <Stacked>
              {renderIcon(address, size)}
              {renderDetails(props)}
            </Stacked>
          )
          : (
            <StackedHorizontal justifyContent={justifyContent}>
              {renderIcon(address, size)}
              <Margin left />
              <Stacked>
                {renderDetails(props)}
              </Stacked>
            </StackedHorizontal>
          );
    })
    .getOrElse(<div>No Address Provided</div>)  
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

const FONT_SIZES: any = {
  tiny: 'small',
  small: 'medium',
  medium: 'large',
  large: 'big'
};

function renderBadge(type: string) {
  return type === 'nominator' ? <SubHeader>nominator</SubHeader> : <SubHeader>validator</SubHeader>   
}

function renderDetails (props: AddressSummaryProps) {
  const { address, detailed, isNominator, isValidator, name = PLACEHOLDER_NAME, noBalance, size = 'medium' } = props;

  return (
    <React.Fragment>
      <DynamicSizeText fontSize={FONT_SIZES[size] as FontSize}> {name} </DynamicSizeText>
      { isNominator && renderBadge('nominator') }
      { isValidator && renderBadge('validator') }
      {!noBalance && <Balance address={address} detailed={detailed} fontSize={FONT_SIZES[size] as FontSize} />}
    </React.Fragment>
  );
}
