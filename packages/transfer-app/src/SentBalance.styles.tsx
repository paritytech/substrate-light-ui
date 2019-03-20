// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@substrate/ui-components';
import styled from 'styled-components';

export const BlueHeader = styled(Header)`
  color: ${props => props.theme.lightBlue1};
  margin-top: 0;
`;
