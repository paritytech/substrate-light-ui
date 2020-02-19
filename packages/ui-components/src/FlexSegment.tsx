// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUISegment, {
  SegmentProps,
} from 'semantic-ui-react/dist/commonjs/elements/Segment';
import styled from 'styled-components';

import { theme } from './globalStyle';

const StyledFlexSegment = styled(SUISegment)`
  &&& {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props): string => props.height || '3rem'};
    width: ${(props): string => props.width || '80%'};
    margin: 0.3rem auto;
    box-shadow: 0 2px 2px 0 rgba(${theme.black}, 0.3);
    background-color: ${(props): string =>
      props.backgroundColor || theme.white};
  }
`;

export function FlexSegment(props: SegmentProps): React.ReactElement {
  return <StyledFlexSegment {...props} />;
}

FlexSegment.Group = SUISegment.Group;
