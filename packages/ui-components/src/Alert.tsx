// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Message as SUIMessage, MessageProps as AlertProps } from 'semantic-ui-react';
import styled from 'styled-components';

// FIXME Put correct colors for `colors.{error,info,warning}`
const colors = {
  error: (props: any) => [props.theme.purple, props.theme.lightBlue1, props.theme.lightBlue2],
  info: (props: any) => [props.theme.purple, props.theme.lightBlue1, props.theme.lightBlue2],
  success: (props: any) => [props.theme.purple, props.theme.lightBlue1, props.theme.lightBlue2],
  warning: (props: any) => [props.theme.purple, props.theme.lightBlue1, props.theme.lightBlue2]
};

type AlertType = keyof typeof colors;

/**
 * CSS Gradients have 3 colors, get the color at index `index`.
 * @param index - The index of the gradient color.
 */
function gradientColor (index: 0 | 1 | 2) {
  return function (props: AlertProps) {
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
      ${gradientColor(1)} 71%,
      ${gradientColor(2)}
    );
    box-shadow: none;
    color: ${props => props.theme.white};
  }
`;
