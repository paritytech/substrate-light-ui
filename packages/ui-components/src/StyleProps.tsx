// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
  align?: string;
  justify?: string;
  textAlign?: string;
}

export interface SubHeaderProps {
  color?: string;
  margin?: string;
  noMargin?: boolean;
}

export interface WithSpaceAroundProps {
  margin?: string;
  padding?: string;
}
