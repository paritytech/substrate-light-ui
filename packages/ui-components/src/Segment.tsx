// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUISegment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import styled from 'styled-components';

const Segment = styled<any>(SUISegment)`
  &&& {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3rem;
    margin: 0.3rem auto;
    box-shadow: 0 2px 2px 0 rgba(${props => props.theme.black}, 0.3);
    background-color: ${props => props.theme.segment};
  }
`;

export default Segment;
