// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUICard, { CardProps as SUICardProps } from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

type CardProps = SUICardProps;

const StyledCard = styled<any>(SUICard)`
 &&& {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  height: ${(props): string => props.height || '357px'};
  min-height: ${(props): string => props.minHeight || '100%'};
  width: ${(props): string => props.width || '100%'};
  overflow: ${(props): string => props.overflow || 'none'};
 }
`;

export function Card (props: CardProps): React.ReactElement {
  return (
    <StyledCard {...props} />
  );
}

Card.Content = SUICard.Content;
Card.Description = SUICard.Description;
Card.Group = SUICard.Group;
Card.Header = SUICard.Header;
