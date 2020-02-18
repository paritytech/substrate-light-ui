// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Dimmer, DimmerDimmableProps, Loader } from 'semantic-ui-react';
import styled from 'styled-components';

import { Stacked } from './Shared.styles';

interface LoadingProps extends DimmerDimmableProps {
  active: boolean;
  loadingText?: string;
}

// Stretch vertically, assuming parent is flex
const Strechted = styled(Dimmer.Dimmable)`
  flex-grow: 1;
`;

export function Loading(props: LoadingProps): React.ReactElement {
  const { active, children, loadingText, ...rest } = props;

  return (
    <>
      {active && (
        <Dimmer.Dimmable as={Strechted} {...rest}>
          <Stacked>
            <Dimmer active>
              <Loader active inverted />
              <p>{loadingText}</p>
            </Dimmer>
          </Stacked>
        </Dimmer.Dimmable>
      )}
      {children}
    </>
  );
}
