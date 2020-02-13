// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FONT_SIZES, FONT_WEIGHTS, MARGIN_SIZES } from './constants';

export * from './stateful/AddressSummary/types';

export type FontSize = keyof typeof FONT_SIZES;

export type FontWeight = keyof typeof FONT_WEIGHTS;

export type MarginSize = keyof typeof MARGIN_SIZES;

export type SUIDisplay = 'inline' | 'block';

export type SUIPosition = 'bottom' | 'left' | 'right' | 'top';

export type FlexAlign =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'baseline';

export type FlexDirection = 'row' | 'column';

export type FlexJustify =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between';

export type SizeType = 'tiny' | 'small' | 'medium' | 'large';
/**
 * Size for <Input />
 */
export type SUIInputSize =
  | 'mini'
  | 'small'
  | 'large'
  | 'big'
  | 'huge'
  | 'massive';
export type SUIBreadcrumbSize = SUIInputSize;

export type SUIColor =
  | 'blue'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'olive'
  | 'green'
  | 'teal'
  | 'violet'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'grey'
  | 'black';

export type SUISize =
  | 'mini'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'big'
  | 'huge'
  | 'massive';

export type SUIProgressBarSize = 'tiny' | 'small' | 'medium' | 'large' | 'big';
