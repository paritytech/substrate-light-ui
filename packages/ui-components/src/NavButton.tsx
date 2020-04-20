// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { StyledNavButton } from './Shared.styles';
import { StyledNavButtonProps } from './StyleProps';
import { FontSize } from './types';

interface NavButtonProps extends StyledNavButtonProps {
  className?: string;
  fontSize?: FontSize;
  fontWeight?: string;
  text?: boolean;
  value?: string;
  negative?: boolean;
  wrapClass?: string;
}

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  default: 'bg-black white f4 fw4',
  negative: 'bg-white black f4 fw4',
};
const mergeClasses = (defaultClass: string, inClassName: string): string => {
  let outClass = defaultClass;

  const rFontSize = /(f)+([0-9])/g;
  const rFontWeight = /(fw)+([0-9])/g;
  const rBg = /(bg-)+([^\s]+)/g;

  const inFontSize = inClassName.match(rFontSize);
  if (inFontSize !== null) {
    outClass = outClass.replace(rFontSize, inFontSize[0]);
    inClassName.replace(inFontSize[0], '');
  }

  const inFontWeight = inClassName.match(rFontWeight);
  if (inFontWeight !== null) {
    outClass = outClass.replace(rFontWeight, inFontWeight[0]);
    inClassName.replace(inFontWeight[0], '');
  }

  const inBg = inClassName.match(rBg);
  if (inBg !== null) {
    outClass = outClass.replace(rBg, inBg[0]);
    inClassName.replace(inBg[0], '');
  }

  return outClass + inClassName;
};

export function NavButton(props: NavButtonProps): React.ReactElement {
  const { children, className, negative, value, ...rest } = props;

  const tachyonsClass = `
    ${negative ? tachyons['negative'] : tachyons['default']}
  `;

  return (
    <StyledNavButton
      className={
        className == undefined
          ? tachyonsClass
          : mergeClasses(tachyonsClass, className)
      }
      {...rest}
    >
      {value || children}
    </StyledNavButton>
  );
}
