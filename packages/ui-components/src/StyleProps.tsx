// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LinkProps } from 'react-router-dom';

import { Color } from './globalStyle';

export interface HeaderProps {
  color?: Color;
  margin?: string;
}

export interface DynamicSizeTextProps {
  fontWeight?: string;
  fontSize?: string;
}

export interface StackProps {
  alignItems?: string; // FIXME Use union of possible string
  justifyContent?: string; // FIXME Use union of possible string
  textAlign?: string; // FIXME Use union of possible string
}

export interface StyledNavLinkProps extends LinkProps {
  inverted?: boolean;
}

export interface SubHeaderProps {
  color?: string;
  margin?: string;
  noMargin?: boolean;
  textAlign?: string;
}

export interface WithSpaceAroundProps {
  margin?: string;
  padding?: string;
}
