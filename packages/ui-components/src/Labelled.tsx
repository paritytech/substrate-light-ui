// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

type Props = {
  isHidden?: boolean,
  label?: any,
  children: any, // node?
  withLabel?: boolean,
  corner?: string,
  content?: any,
  floating?: boolean
};

const defaultLabel: any = (// node?
  <div>&nbsp;</div>
);

export default class Labelled extends React.PureComponent<Props> {
  render () {
    const { children, isHidden = false, label = defaultLabel, withLabel = true } = this.props;

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
