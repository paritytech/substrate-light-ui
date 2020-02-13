// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIIcon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import styled from 'styled-components';

import { substrateLightTheme } from './globalStyle';

export const Icon = styled(SUIIcon)`
  &&& {
    color: ${substrateLightTheme.neonBlue}
    )
  }`;
