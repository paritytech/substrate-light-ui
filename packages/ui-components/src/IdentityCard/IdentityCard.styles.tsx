// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import SUICard from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

export const CardHeader = styled(SUICard.Header)`
  text-align: center;
  font-weight: 300;
  font-size: 28px;
  padding: 1.2rem 0;
`;

export const CardContent = styled(SUICard.Content)`
  display: flex;
  justify-items: space-between;
  align-items: center;
  padding: 0 1rem;
  width: 100%;
`;

// FIXME don't use <any>
// The bug is Exported variable 'StyledCard' has or is using name
// 'CardComponent' from external module
// "node_modules/semantic-ui-react/dist/commonjs/views/Card/Card" but cannot
// be named.ts(4023)
export const StyledCard = styled<any>(SUICard)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 15rem;
  min-width: 100%;
  border: 2px solid black;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
`;
