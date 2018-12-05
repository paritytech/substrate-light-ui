// Copyright 2017-2018 @polkadot/light-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DepGraph } from 'dependency-graph';
import { OperatorFunction } from 'rxjs';

export const ANY_VALUE = Symbol('ANY_VALUE');

export type DepGraphFunction = Array<OperatorFunction<any, any>>;
export type LightDepGraph = DepGraph<DepGraphFunction>;
