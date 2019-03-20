// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { compose, curry, prop } from 'ramda';
import styled from 'styled-components';

import { SUISize } from './types';

export interface MarginProps {
  bottom?: SUISize | boolean; // bottom=true means bottom='medium'
  left?: SUISize | boolean;
  right?: SUISize | boolean;
  top?: SUISize | boolean;
}

/**
 * Mapping between <Margin />'s size and its CSS value.
 */
const sizeValues = (size?: SUISize | boolean) => {
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
};

/**
 * Get value from prop.
 */
const getMarginValue = curry(compose(sizeValues, prop));

export const Margin = styled.div<MarginProps>`
  margin-bottom: ${getMarginValue('bottom')}
  margin-left: ${getMarginValue('left')}
  margin-right: ${getMarginValue('right')}
  margin-top: ${getMarginValue('top')}
`;
