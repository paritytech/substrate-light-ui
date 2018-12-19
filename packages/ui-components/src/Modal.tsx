// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

type Props = {
  [index: string]: any
};

export default class Modal extends React.PureComponent<Props> {
  static Actions = SUIModal.Actions;
  static Content = SUIModal.Content;
  static Header = SUIModal.Header;
  static Description = SUIModal.Description;

  render () {
    return (
      <SUIModal
        {...this.props}
      />
    );
  }
}
