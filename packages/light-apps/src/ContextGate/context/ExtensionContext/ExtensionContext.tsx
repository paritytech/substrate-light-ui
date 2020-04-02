// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Injected from '@polkadot/extension-base/page/Injected';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { sendMessage } from '../../../util/sendMessage';

interface ExtensionContext {
  injected?: Injected;
}

interface ExtensionContextProps {
  children: React.ReactElement;
  originName: string;
}

export const ExtensionContext = React.createContext({} as ExtensionContext);

const l = logger('extension-context');

export function ExtensionContextProvider(
  props: ExtensionContextProps
): React.ReactElement {
  const { children, originName } = props;
  const [injected, setInjected] = useState<Injected>();

  useEffect(() => {
    async function authorize(): Promise<void> {
      await sendMessage('pub(authorize.tab)', { origin });

      const newInjected = new Injected(sendMessage);
      setInjected(newInjected);
    }

    authorize().catch(l.error);
  }, [originName]);

  return (
    <ExtensionContext.Provider value={{ injected }}>
      {children}
    </ExtensionContext.Provider>
  );
}
