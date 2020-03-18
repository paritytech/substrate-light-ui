// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { NodesBlock, NodesConnector, NodeSelector } from './Shared.styles';
import { NodeSelectorProps } from './StyleProps';

interface ConnectedNodesProps extends NodeSelectorProps {
  children?: React.ReactNode;
  nodesClassName?: string;
  connectorClassName?: string;
}
const defaultProps = {
  nodesClassName: 'flex ba br2 pv2 ph3 b--silver',
  connectorClassName: 'bb b--silver',
};

export function ConnectedNodes(
  props: ConnectedNodesProps = defaultProps
): React.ReactElement {
  const {
    children,
    fluid,
    nodesClassName,
    connectorClassName,
    className = 'flex items-center',
  } = props;
  return (
    <NodesBlock fluid={fluid} className={className}>
      {React.Children.map(children, (child, i) => {
        return (
          <>
            {i !== 0 && (
              <NodesConnector
                className={
                  connectorClassName
                    ? connectorClassName
                    : defaultProps.connectorClassName
                }
                fluid={fluid}
              />
            )}
            <NodeSelector
              className={
                nodesClassName ? nodesClassName : defaultProps.nodesClassName
              }
              fluid={fluid}
            >
              {child}
            </NodeSelector>
          </>
        );
      })}
    </NodesBlock>
  );
}
