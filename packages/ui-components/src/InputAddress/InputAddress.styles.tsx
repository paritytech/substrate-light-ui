// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dropdown as SUIDropdown, DropdownItem as SUIDropdownItem } from 'semantic-ui-react';
import styled from 'styled-components';

export const DropdownItemAddress = styled.span`
`;

export const Dropdown = styled<any>(SUIDropdown)`
  display: flex;
  justify-content: space-between;
`;

export const DropdownItem = styled(SUIDropdownItem)`
  display: flex;
  justify-content: space-between;
`;
