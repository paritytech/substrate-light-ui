// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SemanticICONS } from 'semantic-ui-react/dist/commonjs';

export type RouteProps = {
  basePath: string
};

export type Route = {
  Component: React.ComponentType<RouteProps>,
  icon: SemanticICONS,
  isApiGated: boolean,
  isHidden: boolean,
  name: string,
  path: string
};

export type Routing = {
  default: Route,
  routes: Route[]
};
