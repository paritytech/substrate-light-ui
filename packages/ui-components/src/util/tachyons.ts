// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const tachyonsClasses = [
  // font size
  /(f)+([0-9])/g,
  // font weight
  /(fw)+([0-9])/g,
  // background color
  /(bg-)+([^\s]+)/g,
  // border color
  /(b--)+([^\s]+)/g,
  // margin
  /(ma)+([0-9])/g,
  /(mh)+([0-9])/g,
  /(mv)+([0-9])/g,
  /(mb)+([0-9])/g,
  /(mt)+([0-9])/g,
  /(ml)+([0-9])/g,
  /(mr)+([0-9])/g,
];

export const mergeClasses = (
  defaultClass: string,
  inClass: string | undefined
): string => {
  if (!inClass) {
    return defaultClass;
  }

  let outClass = defaultClass;

  tachyonsClasses.forEach((tachyonsClass: RegExp) => {
    const match = tachyonsClass.exec(inClass);
    if (match) {
      outClass = outClass.replace(tachyonsClass, match[0]);
      inClass.replace(match[0], '');
    }
  });

  return `${outClass} ${inClass}`;
};
