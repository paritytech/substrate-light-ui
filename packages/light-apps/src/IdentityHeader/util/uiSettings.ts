// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import uiSettings from '@polkadot/ui-settings';

const KEY_PREFIX = '__dropdown_option_';

const nodeOptions: Array<any> = [];

uiSettings.availableNodes.forEach(availNode => {
  nodeOptions.push({
    key: `${KEY_PREFIX}${availNode.value}`,
    value: availNode.value,
    text: availNode.text
  });
});