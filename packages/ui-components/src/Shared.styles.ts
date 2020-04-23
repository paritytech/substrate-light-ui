// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import styled from 'styled-components';

export const ContainerFlex = styled(SUIContainer).attrs({
  className: 'flex items-center',
})`
  display: flex !important;
  flex-wrap: wrap;
}
`;

/* TODO compomnent with actions */
export const FramedBlock = styled.div`
  padding: 2rem;
  position: relative;
  border-style: solid;
  border-width: 1px;
`;
