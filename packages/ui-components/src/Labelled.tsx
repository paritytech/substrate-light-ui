// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

type Props = {
  children: React.ReactNode,
  isHidden?: boolean,
  label?: React.ReactNode,
  withLabel?: boolean
};

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { children, isHidden = false, label, withLabel = false } = this.props;

    if (isHidden) {
      return null;
    }

    return (
      <div>
        {
          withLabel
            ? <Label>
                {label}
              </Label>
            : null
        }
        {children}
      </div>
    );
  }
}
