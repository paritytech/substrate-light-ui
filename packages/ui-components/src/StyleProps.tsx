// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Color } from './globalStyle';
import { FlexAlign, FlexJustify, MarginSize } from './types';

export interface HeaderProps {
  color?: Color;
  margin?: MarginSize;
  noMargin?: boolean;
  textAlign?: string;
}

// TODO: tachyon class vs props pattern
export interface StackProps {
  alignItems?: FlexAlign;
  justifyContent?: FlexJustify;
  wrapAt?: number | string;
}

export interface StyledNavLinkProps {
  inverted?: boolean;
}

export interface NodeSelectorProps {
  fluid?: boolean;
  className?: string;
}

// TODO ScreenSizes
