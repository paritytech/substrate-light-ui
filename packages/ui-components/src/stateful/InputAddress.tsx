// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyringOption from '@polkadot/ui-keyring/options';
import React, { useEffect, useState } from 'react';
import { map } from 'rxjs/operators';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem';

export interface InputAddressProps extends DropdownProps {
}

export function InputAddress (props: InputAddressProps) {
  const [options, setOptions] = useState<DropdownItemProps[]>();

  useEffect(() => {
    let subscription = keyringOption
      .optionsSubject
      .pipe(
        map(({ account }) => account.map(acc => ({ ...acc, text: acc.value })) as DropdownItemProps[])
      )
      .subscribe(setOptions);

    return () => subscription.unsubscribe();
  }, []);

  if (!options) {
    return null;
  }

  return (
    <Dropdown
      options={options}
      {...props}
    />
  );
}
