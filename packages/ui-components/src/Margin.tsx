// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';

import { MARGIN_SIZES } from './constants';
import { SUISize } from './types';

type MarginPropsValue = SUISize | boolean | undefined;

interface MarginProps {
  bottom?: MarginPropsValue; // bottom=true means bottom='medium'
  left?: MarginPropsValue;
  right?: MarginPropsValue;
  top?: MarginPropsValue;
}

/**
 * Mapping between <Margin />'s size and its CSS value.
 */
function sizeValues (size: MarginPropsValue): string {
  switch (size) {
    case true:
      return MARGIN_SIZES.medium;
    case 'small':
    case 'medium':
    case 'large':
    case 'big':
    case 'huge':
      return MARGIN_SIZES[size];
    default: return '0';
  }
}

/**
 * Get value from prop.
 */
const getMarginValue = (position: keyof MarginProps) => (props: MarginProps): string =>
  sizeValues(props[position]);

export const Margin = styled.div<MarginProps>`
  margin-bottom: ${getMarginValue('bottom')}
  margin-left: ${getMarginValue('left')}
  margin-right: ${getMarginValue('right')}
  margin-top: ${getMarginValue('top')}
`;
