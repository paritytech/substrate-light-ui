// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUICard, {
  CardProps as SUICardProps,
} from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

type CardProps = SUICardProps;

const StyledCard = styled<typeof SUICard>(SUICard)`
  &&& {
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
    height: ${(props: CardProps): string => props.height || '357px'};
    min-height: ${(props: CardProps): string => props.minHeight || '100%'};
    width: ${(props: CardProps): string => props.width || '100%'};
    overflow: ${(props: CardProps): string => props.overflow || 'none'};
  }
`;

export function Card(props: CardProps): React.ReactElement {
  return <StyledCard {...props} />;
}

Card.Content = SUICard.Content;
Card.Description = SUICard.Description;
Card.Group = SUICard.Group;
Card.Header = SUICard.Header;
