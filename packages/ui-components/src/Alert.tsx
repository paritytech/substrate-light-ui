// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Message as SUIMessage, MessageProps } from 'semantic-ui-react';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

const colors = {
  error: 'bg-red',
  info: 'bg-black',
  success: 'bg-green',
  warning: 'bg-yellow',
};
const tachyons = {
  default: 'white br3 mb1',
};

interface AlertProps extends MessageProps {
  alertType?: keyof typeof colors;
}

const StyledMessage = styled(SUIMessage)`
  &&& {
    background: transparent;
    box-shadow: none;
    margin: 0;
    display: inline-flex;
    color: inherit;
  }
`;

export function Alert(props: AlertProps): React.ReactElement {
  const { className, alertType = 'info', ...rest } = props;

  const tachyonsClass = `
    ${tachyons['default']} 
    ${alertType ? colors[alertType] : ''}`;

  return (
    <div className={mergeClasses(tachyonsClass, className)}>
      <StyledMessage {...rest} />
    </div>
  );
}
