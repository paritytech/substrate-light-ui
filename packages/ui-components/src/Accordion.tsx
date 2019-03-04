// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { Component } from 'react';
import SUIAccordion from 'semantic-ui-react/dist/commonjs/modules/';

type Props = {
  active: boolean,
  children?: React.ReactNode | string,
  title?: string,
  toggleActive: (event: React.MouseEvent<HTMLInputElement>) => void
};

class Accordion extends React.PureComponent<Props> {
  handleClick = (event) => {
    this.props.toggleActive(event);
  }

  render () {
    const { active, children, title } = this.props;

    return (
      <Accordion fluid styled>
        <Accordion.Title active={active} onClick={this.handleClick}>
          <Icon name='dropdown' />
          {title}
        </Accordion.Title>
        <Accordion.Content active={active}>
          {children}
        </Accordion.Content>
      </Accordion>
    );
  }
}
