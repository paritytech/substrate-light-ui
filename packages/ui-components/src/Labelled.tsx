// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

import { StackedHorizontal } from './index';

type LabelledProps = {
  children: React.ReactNode;
  isHidden?: boolean;
  label?: React.ReactNode;
  withLabel?: boolean;
};

export function Labelled (props: LabelledProps): React.ReactElement | null {
  const { children, isHidden = false, label, withLabel = false } = props;

  if (isHidden) {
    return null;
  }

  return (
    <StackedHorizontal justifyContent='space-around'>
      {withLabel && <Label>{label}</Label>}
      {children}
    </StackedHorizontal>
  );
}
