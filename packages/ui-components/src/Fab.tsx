// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIButton, {
  ButtonProps,
} from 'semantic-ui-react/dist/commonjs/elements/Button';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';
import { Icon } from './Icon';

const SUIFab = styled(SUIButton)`
  &&& {
    background-color: ${polkadotOfficialTheme.signal}
    display: flex;
    justify-content: center;
    padding: 0;

    color: white;
    height: ${(props): string => props.height || '4rem'};
    width: ${(props): string => props.width || '4rem'};
    border-radius: 16px;
    box-shadow: 0 8px 12px ${polkadotOfficialTheme.shadow};
    
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    .icon {
      opacity: 1;
      margin: 0 !important;
    }
  }
`;

type FabTypes = 'add' | 'send';

interface Props extends ButtonProps {
  type?: FabTypes;
}

export function Fab(props: Props): React.ReactElement {
  return (
    <SUIFab {...props}>
      {props.type === 'add' ? (
        <Icon name='add' size='large' />
      ) : (
        <Icon name='send' size='large' />
      )}
    </SUIFab>
  );
}
