// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import SUICard from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

export const CardHeader = styled(SUICard.Header)`
  &&& {
    text-align: left;
    font-weight: 300;
    font-size: 28px;
    margin-top: 2rem;
  }
`;

// Margin-left added as pseudoelement is screwing with justify-content.
// This is a known issue with flexbox with no clean solution at the moment.
// https://stackoverflow.com/questions/40686928/pseudo-elements-breaking-justify-content-space-between-in-flexbox-layout
export const CardContent = styled(SUICard.Content)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 1rem;
    margin-left: 5rem;
    min-width: 100%;
    border: none;
  }
`;

// FIXME don't use <any>
// The bug is Exported variable 'StyledCard' has or is using name
// 'CardComponent' from external module
// "node_modules/semantic-ui-react/dist/commonjs/views/Card/Card" but cannot
// be named.ts(4023)
export const StyledCard = styled<any>(SUICard)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 15rem;
    min-width: 100%;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    border: 0.5px solid #f2f2f2;
  }
`;
