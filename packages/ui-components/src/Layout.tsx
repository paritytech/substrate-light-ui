// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { mergeClasses } from './util/tachyons';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  framed?: boolean;
  alert?: boolean;
}

const tachyons = {
  default: 'relative flex items-center',
  framed: 'ba flex-wrap pa3',
  alert: 'fixed flex flex-column items-end right-0 top-0 ma1',
};

export function Layout(props: LayoutProps): React.ReactElement {
  const { children, className, alert, framed = false, ...rest } = props;

  const tachyonsClass = `
      ${alert ? tachyons['alert'] : tachyons['default']}
      ${framed ? tachyons['framed'] : ''}
  `;

  return (
    <div className={mergeClasses(tachyonsClass, className)} {...rest}>
      {children}
    </div>
  );
}
