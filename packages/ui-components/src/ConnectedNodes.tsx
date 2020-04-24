// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { mergeClasses } from './util/tachyons';

interface NodeSelectorProps {
  className?: string;
  fluid?: boolean;
}
interface ConnectedNodesProps extends NodeSelectorProps {
  children?: React.ReactNode;
  nodesClassName?: string;
  connectorClassName?: string;
}
const defaultProps = {
  blockClassName: 'flex items-center relative',
  connectorClassName: 'bb b--silver',
  nodesClassName: 'flex ba br2 b--silver',
};
const NodesBlock = styled.span<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
  color: inherit important!;
`;
const NodeSelector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
`;
const NodesConnector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '50%' : '100px')};
  transform: translateY(-50%);
  min-width: 2rem;
`;

export function ConnectedNodes(
  props: ConnectedNodesProps = defaultProps
): React.ReactElement {
  const {
    children,
    fluid = true,
    nodesClassName,
    connectorClassName,
    className,
  } = props;

  return (
    <NodesBlock
      fluid={fluid}
      className={mergeClasses(defaultProps.blockClassName, className)}
    >
      {React.Children.map(children, (child, i) => {
        return (
          <>
            {i !== 0 && (
              <NodesConnector
                className={mergeClasses(
                  defaultProps.connectorClassName,
                  connectorClassName
                )}
                fluid={fluid}
              />
            )}
            <NodeSelector
              className={mergeClasses(
                defaultProps.nodesClassName,
                nodesClassName
              )}
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
