// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUISegment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import styled from 'styled-components';

const Segment = styled<any>(SUISegment)`
  &&& {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 3rem;
    margin-bottom: 0.3rem;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.3);
    background-color: #fdfefe;
  }
`;

export default Segment;
