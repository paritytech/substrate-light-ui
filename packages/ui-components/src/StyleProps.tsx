// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Color } from './globalStyle';
import { MarginSize } from './types';

export interface HeaderProps {
  color?: Color;
  margin?: MarginSize;
  noMargin?: boolean;
  textAlign?: string;
}

export interface NodeSelectorProps {
  fluid?: boolean;
  className?: string;
}

// TODO ScreenSizes
