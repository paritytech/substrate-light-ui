// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FONT_SIZES, MARGIN_SIZES } from './constants';

export type FontSize = keyof typeof FONT_SIZES;

export type MarginSize = keyof typeof MARGIN_SIZES;

export type SUIDisplay = 'inline' | 'block';

export type SUIPosition = 'bottom' | 'left' | 'right' | 'top';

/**
 * Size for <Input />
 */
export type SUIInputSize = 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive';

export type SUISize = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
