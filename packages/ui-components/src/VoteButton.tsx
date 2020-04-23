// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

interface VoteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  value?: string;
  negative?: boolean;
  wrapClass?: string;
  vote: 'yay' | 'nay';
}

const StyledVoteButton = styled.button`
  border-radius: 9999px;
  outline: none;
  overflow: hidden;
  transition: background-color 0.3s;
  padding: 0.3em 1em;

  :hover {
    opacity: 0.9;
    cursor: ${(props): string => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

// TEMPORARY, to be moved to shared/constants
const tachyons = {
  yay: 'bg-washed-red dark-red b--dark-red f7',
  nay: 'bg-lightest-blue dark-blue b--dark-blue f7',
};

export function VoteButton(props: VoteButtonProps): React.ReactElement {
  const { children, className, value, wrapClass, vote, ...rest } = props;

  const tachyonsClass = tachyons[vote];

  return (
    <div className={wrapClass}>
      <StyledVoteButton
        className={mergeClasses(tachyonsClass, className)}
        {...rest}
      >
        {value || children}
      </StyledVoteButton>
    </div>
  );
}
