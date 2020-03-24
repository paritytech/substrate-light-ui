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
  borderless?: boolean;
  fake?: boolean;
  input?: string | null;
  textLabelInline?: boolean;
  textLabel?: string | number | null;
  wrapClass?: string;
}

//TODO: clean up
const styles = {
  inputFieldText: `
    padding: 0.65em 0.7em;
    background: ${polkadotOfficialTheme.eggShell};
    line-height: 1.2;
  `,
  inputFieldNumber: `
    margin-top: 0.25rem;
    padding: 0.65em 0.7em;
    padding-left: 1rem;
    border-left: 2px solid black;
    font-weight: 600;
    line-height: 1.2;
    .label:first-child {
      border-left: 2px solid red;
      border-radius: 0;
      background: transparent;
    }
  `,
};

const StyledFakeInput = styled.span`
  display: inline-block;
  ${styles.inputFieldText}
`;

const StyledInput = styled<typeof SUIInput>(SUIInput)`
  &&& {
    > input {
      border: none;
      border-radius: 0;
      &[type='text'] {
        ${(props): string =>
          props.borderless ? '' : 'border-bottom: 1px solid black;'};
        ${styles.inputFieldText}
      }
      &[type='number'] {
        ${styles.inputFieldNumber}
      }
    }
    &.labeled .label {
      font-weight: 300;
      color: black;
      background: ${polkadotOfficialTheme.eggShell};
    }
  }
`;

const StyledLabel = styled.label`
  display: ${(props): string =>
    props.textLabelInline ? 'inline-flex' : 'flex'};
  margin-right: 0.5em;
`;

export function Input(props: InputProps): React.ReactElement {
  const {
    textLabel,
    wrapClass = 'mb3',
    textLabelInline = false,
    value,
    fake,
    ...rest
  } = props;
  return (
    <div className={wrapClass}>
      {textLabel && (
        <StyledLabel textLabelInline={textLabelInline}>{textLabel}</StyledLabel>
      )}
      {fake ? (
        <StyledFakeInput>{value}</StyledFakeInput>
      ) : (
        <StyledInput value={value} {...rest} />
      )}
    </div>
  );
}
