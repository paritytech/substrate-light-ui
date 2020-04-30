// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const tachyonsClasses = [
  // border radius
  /(br)+([0-9])/,
  // font size
  /(f)+([0-9])/,
  // font weight
  /(fw)+([0-9])/,
  // background color
  /(bg-)+([^\s]+)/,
  // border color
  /(b--)+([^\s]+)/,
  // margin
  /(ma)+([0-9])/,
  /(mh)+([0-9])/,
  /(mv)+([0-9])/,
  /(mb)+([0-9])/,
  /(mt)+([0-9])/,
  /(ml)+([0-9])/,
  /(mr)+([0-9])/,
  // align-items
  /(items-)+([^\s]+)/,
  // width
  /(w-)+([0-9])+/,
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

export const extractClasses = (
  inClass: string | undefined,
  xClass: string
): string => {
  let outClass = '';

  if (!inClass) return outClass;

  const xClasses = xClass.split(' ');

  xClasses.forEach((x: string) => {
    tachyonsClasses.forEach((tachyonsClass: RegExp) => {
      if (tachyonsClass.exec(x)) {
        const match = tachyonsClass.exec(inClass);
        if (match) {
          outClass = `${outClass} ${match[0]}`;
        }
      }
    });
  });

  return `${outClass}`;
};
