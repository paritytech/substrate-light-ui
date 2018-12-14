// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Button } from 'semantic-ui-react';

type Props = {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  value?: any
};

export default class CopyButton extends React.PureComponent<Props> {
  render () {
    const { icon = 'copy', isCircular = true, isPrimary = true, size = 'tiny', value } = this.props;

    return (
      <CopyToClipboard text={value}>
        <Button
          icon={icon}
          isCircular={isCircular}
          isPrimary={isPrimary}
          size={size}
        />
      </CopyToClipboard>
    );
  }
}
