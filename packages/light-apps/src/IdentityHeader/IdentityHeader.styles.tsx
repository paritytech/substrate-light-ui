// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
import styled from 'styled-components';

// These styles are the same as if we added `fluid={true}` prop. Unfortunately
// PolkadotInputAddress doesn't pass down props to SUI components.
export const InputAddress = styled(PolkadotInputAddress)`
  .dropdown {
    min-width: 0;
    width: '25%';
  }
`;
