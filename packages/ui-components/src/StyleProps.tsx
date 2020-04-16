// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Color } from './globalStyle';
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  FontSize,
  MarginSize,
} from './types';

export interface HeaderProps {
  color?: Color;
  margin?: MarginSize;
  noMargin?: boolean;
  textAlign?: string;
}

export interface DynamicSizeTextProps {
  fontWeight?: string;
  fontSize?: FontSize;
}

export interface StyledNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  negative?: boolean;
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

export interface SubHeaderProps {
  color?: Color;
  margin?: MarginSize;
  noMargin?: boolean;
  textAlign?: string;
}

export interface WithSpaceBetweenProps {
  flexDirection?: FlexDirection;
}

export interface NodeSelectorProps {
  fluid?: boolean;
  className?: string;
}

// TODO ScreenSizes
