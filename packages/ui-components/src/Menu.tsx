// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIMenu from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu';
import SUIDivider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';

type MenuDef = typeof SUIMenu & {
  Divider: typeof SUIDivider;
};

export const Menu: MenuDef = SUIMenu as MenuDef;

Menu.Divider = SUIDivider;
