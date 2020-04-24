// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import { Layout } from './Layout';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean;
  inline?: boolean;
  loadingText?: string;
}

// Stretch vertically, assuming parent is flex, and invert colors
const Inverted = styled.div`
  background-color: black;
  color: white;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  opacity: 0.5;
`;

export function Loading(props: LoadingProps): React.ReactElement {
  const { active, children, inline, loadingText, ...rest } = props;

  return (
    <>
      {active && (
        <Inverted {...rest}>
          <Layout className='content-center'>
            <Loader active inline={inline} />
            <p>{loadingText}</p>
          </Layout>
        </Inverted>
      )}
      {children}
    </>
  );
}
