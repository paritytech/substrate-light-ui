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

export interface FlexItemProps {
  flex?: number;
  margin?: MarginSize;
  padding?: MarginSize;
}

export interface StyledNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  negative?: boolean;
}

export interface StackProps {
  alignItems?: FlexAlign;
  justifyContent?: FlexJustify;
  margin?: string;
  textAlign?: string; // FIXME Use union of possible string
  width?: string;
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

export interface WithSpaceAroundProps {
  margin?: MarginSize;
  padding?: MarginSize;
}

export interface WithSpaceBetweenProps {
  flexDirection?: FlexDirection;
}

export interface WrapperDivProps {
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
}
