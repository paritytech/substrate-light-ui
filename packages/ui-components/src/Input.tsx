// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { TextInputArea } from './Shared.styles';
type Input$Type = 'number' | 'password' | 'text';
import { isUndefined } from '@polkadot/util';
import Labelled from './Labelled';

type Props = {
  autoFocus?: boolean,
  children?: React.ReactNode,
  defaultValue?: any,
  icon?: React.ReactNode,
  isAction?: boolean,
  isDisabled?: boolean,
  isEditable?: boolean,
  isError?: boolean,
  isHidden?: boolean,
  label?: React.ReactNode,
  max?: any,
  maxLength?: number,
  min?: any,
  name?: string,
  onChange: (value: string) => void,
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void,
  onKeyUp?: (event: React.KeyboardEvent<Element>) => void,
  placeholder?: string,
  tabIndex?: number,
  type?: Input$Type,
  value?: any,
  withLabel?: boolean
};

type State = {
  name: string;
};

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
    const { autoFocus = false, children, defaultValue, icon, isEditable = false, isAction = false, isDisabled = false, isError = false, isHidden = false, label, max, maxLength, min, name, placeholder, tabIndex, type = 'text', value, withLabel } = this.props;

    return (
      <Labelled
        label={label}
        withLabel={withLabel}
        floating
        >
        <TextInputArea
          action={isAction}
          autoFocus={autoFocus}
          defaultValue={
            isUndefined(value)
              ? (defaultValue || '')
              : undefined
          }
          disabled={isDisabled}
          error={isError}
          hidden={isHidden}
          id={name}
          iconPosition={
            isUndefined(icon)
              ? undefined
              : 'left'
          }
          max={max}
          maxLength={maxLength}
          min={min}
          name={name || this.state.name}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={placeholder}
          tabIndex={tabIndex}
          type={type}
          value={value}
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
          {icon}
          {children}
        </TextInputArea>
      </Labelled>
    );
  }

  private onChange = (event: React.SyntheticEvent<Element>): void => {
    const { onChange } = this.props;
    const { value } = event.target as HTMLInputElement;

    onChange(value);
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
