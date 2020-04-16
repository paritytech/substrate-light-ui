// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUITextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

type TextAreaProps = {
  className?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rows?: number;
  value?: string;
  signal?: boolean;
};

export function TextArea(props: TextAreaProps): React.ReactElement {
  const { placeholder, rows, value, signal, ...rest } = props;

  const StyledTextArea = styled<typeof SUITextArea>(SUITextArea)`
    &&& {
      border: none;
      padding: 0;
      outline: none;
      min-height: 4rem;
      width: 100%;
      ${signal
        ? `font-weight: 400;
        font-family: ${polkadotOfficialTheme.typography.monospace};
        color: ${polkadotOfficialTheme.signal} !important;
      `
        : ''}
    }
  `;

  return (
    <StyledTextArea
      placeholder={placeholder}
      rows={rows}
      value={value}
      {...rest}
    />
  );
}
