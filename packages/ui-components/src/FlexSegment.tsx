// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUISegment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import styled from 'styled-components';

import { substrateLightTheme } from './globalStyle';

export const FlexSegment = styled<any>(SUISegment)`
  &&& {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${(props): string => props.height || '3rem'};
    width: ${(props): string => props.width || '80%'};
    margin: 0.3rem auto;
    box-shadow: 0 2px 2px 0 rgba(${substrateLightTheme.black}, 0.3);
    background-color: ${(props): string => props.backgroundColor || substrateLightTheme.white};
  }
`;
