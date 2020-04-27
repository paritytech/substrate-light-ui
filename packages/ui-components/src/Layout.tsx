// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { mergeClasses } from './util/tachyons';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  framed?: boolean;
}

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'relative flex items-center',
  framed: 'ba flex-wrap pa3',
};

export function Layout(props: LayoutProps): React.ReactElement {
  const { children, className, framed = false, ...rest } = props;

  const tachyonsClass = `
      ${tachyons['default']}
      ${framed && tachyons['framed']}
  `;

  return (
    <div className={mergeClasses(tachyonsClass, className)} {...rest}>
      {children}
    </div>
  );
}
