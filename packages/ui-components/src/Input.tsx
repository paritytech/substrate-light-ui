// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isUndefined } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import { InputProps } from 'semantic-ui-react/dist/commonjs/elements/Input';

import Labelled from './Labelled';

type Input$Type = 'number' | 'password' | 'text';

interface Props extends InputProps {
  autoFocus?: boolean;
  defaultValue?: any;
  isEditable?: boolean;
  isHidden?: boolean;
  max?: any;
  maxLength?: number;
  min?: any;
  name?: string;
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void;
  onKeyUp?: (event: React.KeyboardEvent<Element>) => void;
  placeholder?: string;
  type?: Input$Type;
  value?: any;
  withLabel?: boolean;
}

type State = {
  name: string;
};

export const TextInputArea = styled(SUIInput)`
  &&& {
    box-shadow: 0 2px 4px 0 rgba(${props => props.theme.black}, 0.5);
    background-color: ${props => props.theme.white};
    color: ${props => props.theme.grey};
    height: $(props => props.height || 109px)
    min-width: 100%;
  }
`;

// note: KeyboardEvent.keyCode and KeyboardEvent.which are deprecated
const KEYS = {
  A: 'a',
  ALT: 'Alt',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  BACKSPACE: 'Backspace',
  C: 'c',
  CMD: 'Meta',
  CTRL: 'Control',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  V: 'v',
  X: 'x',
  ZERO: '0'
};

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

// reference: degrade key to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
const isCopy = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.C;

const isCut = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.X;

const isPaste = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.V;

const isSelectAll = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.A;

let counter = 0;

// FIXME: Input component should be reused from @polkadot-js/ui, once it's there
export default class Input extends React.PureComponent<Props, State> {
  state: State = {
    name: `in_${counter++}_at_${Date.now()}`
  };

  render () {
    const { autoFocus = false, children, defaultValue, isEditable = false, action = false, disabled = false, error = false, isHidden = false, label, max, maxLength, min, name, placeholder, type = 'text', value, withLabel, ...otherProps } = this.props;

    return (
      <Labelled
        label={label}
        withLabel={withLabel}
        >
        <TextInputArea
          action={action}
          autoFocus={autoFocus}
          defaultValue={
            isUndefined(value)
              ? (defaultValue || '')
              : undefined
          }
          disabled={disabled}
          error={error}
          hidden={isHidden}
          id={name}
          max={max}
          maxLength={maxLength}
          min={min}
          name={name || this.state.name}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={placeholder}
          type={type}
          value={value}
          {...otherProps}
        >
          <input
            autoComplete={
              type === 'password'
                ? 'new-password'
                : 'off'
            }
          />
          {
            isEditable
              ? <i className='edit icon' />
              : undefined
          }
          {children}
        </TextInputArea>
      </Labelled>
    );
  }

  private onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { onKeyDown } = this.props;

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  private onKeyUp = (event: React.KeyboardEvent<Element>): void => {
    const { onKeyUp } = this.props;

    if (onKeyUp) {
      onKeyUp(event);
    }
  }
}

export {
  isCopy,
  isCut,
  isPaste,
  isSelectAll,
  KEYS,
  KEYS_PRE
};
