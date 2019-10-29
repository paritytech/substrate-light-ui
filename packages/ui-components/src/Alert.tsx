// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Message as SUIMessage, MessageProps as AlertProps } from 'semantic-ui-react';
import styled from 'styled-components';

import { StyledProps } from './globalStyle';

const colors = {
  error: (props: StyledProps): [string, string] => [props.theme.redOrange, props.theme.coral],
  info: (props: StyledProps): [string, string] => [props.theme.robinEggBlue, props.theme.neonBlue],
  success: (props: StyledProps): [string, string] => [props.theme.lightBlue1, props.theme.purple],
  warning: (props: StyledProps): [string, string] => [props.theme.orangeYellow, props.theme.tangerine]
};

type AlertType = keyof typeof colors;

/**
 * Alert Bar CSS Gradients have 2 colors, get the color at index `index`.
 * @param index - The index of the gradient color.
 */
function gradientColor (index: 0 | 1) {
  return function (props: AlertProps & StyledProps): string {
    // Check if props.{error, info, warning} is set.
    const alertType = ['error', 'info', 'warning'].find(type => props[type]) as AlertType | undefined;
    if (alertType) {
      return colors[alertType](props)[index];
    }

    // By default we return the success gradient
    return colors.success(props)[index];
  };
}

export const Alert = styled<any>(SUIMessage)`
  &&& {
    background-image: linear-gradient(
      107deg,
      ${gradientColor(0)},
      ${gradientColor(1)} 71%
    );
    bottom: 0;
    left: 0;
    box-shadow: none;
    color: ${(props): string => props.theme.white};
    padding-bottom: 2rem;
    padding-left: 4rem;
    padding-right: 6rem;
    position: fixed;
    width: 100%;
  }
`;
