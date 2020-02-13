// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIButton, {
  ButtonProps,
} from 'semantic-ui-react/dist/commonjs/elements/Button';
import styled from 'styled-components';

import { substrateLightTheme } from './globalStyle';
import { Icon } from './Icon';

const SUIFab = styled(SUIButton)`
  &&& {
    background-image: ${`linear-gradient(
      107deg,
      ${substrateLightTheme.lightBlue1},
      ${substrateLightTheme.neonBlue}
    )`};
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    vertical-align: center;
    color: white;
    height: ${(props): string => props.height || '4rem'};
    width: ${(props): string => props.width || '4rem'};
    box-shadow: '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)';
    border-radius: 50%;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000000;
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
        <Icon name='add' size='large' style={{ marginLeft: '8px' }} />
      ) : (
        <Icon name='send' size='large' style={{ marginLeft: '3.9px' }} />
      )}
    </SUIFab>
  );
}
