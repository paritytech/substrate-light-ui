// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import SUISidebar from 'semantic-ui-react/dist/commonjs/modules/Sidebar/index';
import SUISidebarPushable from 'semantic-ui-react/dist/commonjs/modules/Sidebar/SidebarPushable';

type SidebarDef = typeof SUISidebar & {
  SidebarPushableDef: typeof SUISidebarPushable
};

const Sidebar: SidebarDef = SUISidebar as SidebarDef;

Sidebar.Pushable = SUISidebarPushable;

export default Sidebar;
