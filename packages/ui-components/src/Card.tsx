// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import SUICard from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

type Props = {
  [index: string]: any;
};

const StyledCard = styled<any>(SUICard)`
 &&& {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  height: 357px;
  width: 100%;
  overflow: ${props => props.overflow || 'none'};
 }
`;

export class Card extends React.PureComponent<Props> {
  // TODO: move away from the defaults and use custom subcomponents
  static Header = SUICard.Header;
  static Description = SUICard.Description;
  static Content = SUICard.Content;

  render () {
    return (
      <StyledCard {...this.props} />
    );
  }
}

export default Card;
