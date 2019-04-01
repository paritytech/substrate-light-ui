// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { compose } from 'fp-ts/lib/function';
import { Functor } from 'fp-ts/lib/Functor';
import { Option } from 'fp-ts/lib/Option';
import styled from 'styled-components';

import { SUISize } from './types';
import { prop } from './util/fp';

type MarginPropsValue = SUISize | boolean | undefined;

export interface MarginProps {
  bottom?: MarginPropsValue; // bottom=true means bottom='medium'
  left?: MarginPropsValue;
  right?: MarginPropsValue;
  top?: MarginPropsValue;
}

/**
 * Mapping between <Margin />'s size and its CSS value.
 */
function sizeValues (size: MarginPropsValue) {
  switch (size) {
    case 'small': return '0.5rem';
    case true:
    case 'medium':
      return '1rem';
    case 'large': return '1rem';
    case 'big': return '2rem';
    case 'huge': return '3.5rem';
    default: return '0';
  }
}

/**
 * Get value from prop.
 */
const getMarginValue = compose<
  keyof MarginProps,
  (props: MarginProps) => Option<MarginPropsValue>,
  (props: MarginProps) => ReturnType<typeof sizeValues>
>(
  map(sizeValues),
  prop
);

export const Margin = styled.div<MarginProps>`
  margin-bottom: ${getMarginValue('bottom')}
  margin-left: ${getMarginValue('left')}
  margin-right: ${getMarginValue('right')}
  margin-top: ${getMarginValue('top')}
`;
