// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIInput, {
  InputProps as SUIInputProps,
} from 'semantic-ui-react/dist/commonjs/elements/Input';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

interface InputProps extends SUIInputProps {
  input?: string | null;
  label?: string | null;
  wrapClass?: string;
}

const StyleTab = {
  menu: '',
};

const StyledInput = styled<typeof SUIInput>(SUIInput)`
  &&& {
    ${(props): string => (props.tabs ? StyleTab.menu : '')};
    > input {
      border: none;
      border-bottom: 1px solid black;
      border-radius: 0;
      background: ${polkadotOfficialTheme.eggShell};

      &[type='number'] {
        text-align: center;
      }
    }
    &.labeled .label {
      min-width: 100px;
      text-align: center;
      font-weight: 300;
      color: black;
      background: ${polkadotOfficialTheme.black};
      color: ${polkadotOfficialTheme.eggShell};
    }
  }
  width: ${(props): string => props.width || '100%'};
`;

export function Input(props: InputProps): React.ReactElement {
  const { textLabel, wrapClass = 'mb3', ...rest } = props;
  return (
    <div className={wrapClass}>
      {textLabel && <label className='flex fw5 f6'>{textLabel}</label>}
      <StyledInput {...rest} />
    </div>
  );
}
