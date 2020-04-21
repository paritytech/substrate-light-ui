// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import {
  Header as SUIHeader,
  HeaderProps as SUIHeaderProps,
} from 'semantic-ui-react';
import styled from 'styled-components';

interface HeaderProps extends SUIHeaderProps {
  wrapClass?: string;
}

const StyledHeader = styled(SUIHeader)<HeaderProps>``;

export function Header(props: HeaderProps): React.ReactElement {
  const { as = 'h2', children, wrapClass, ...rest } = props;

  return (
    <div className={wrapClass}>
      <StyledHeader as={as} {...rest}>
        {children}
      </StyledHeader>
    </div>
  );
}
