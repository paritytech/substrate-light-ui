// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SemanticICONS } from 'semantic-ui-react/dist/commonjs';
import { RouteComponentProps } from 'react-router';

export type RouteProps = RouteComponentProps & {
  basePath: string
};

export type Route = {
  Component: React.ComponentType<RouteProps>,
  icon: SemanticICONS,
  name: string,
  path: string
};

export type Routing = {
  default: Route,
  routes: Route[]
};
