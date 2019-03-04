// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { Component } from 'react';
import SUIAccordion from 'semantic-ui-react/dist/commonjs/modules/Accordion';

type Props = {
  [index: string]: any
};

export default class Accordion extends React.PureComponent<Props> {
  static Accordion = SUIAccordion.Accordion;
  static Content = SUIAccordion.Content;
  static Panel = SUIAccordion.Panel;
  static Title = SUIAccordion.Title;

  render () {
    return (
      <SUIAccordion
        {...this.props}
      />
    );
  }
}
