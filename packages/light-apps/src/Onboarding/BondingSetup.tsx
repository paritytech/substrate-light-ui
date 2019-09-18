// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bond } from '@substrate/accounts-app';
import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Card, Modal } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

interface Props extends RouteComponentProps { }

export function BondingSetup (props: Props) {
  const [controller, setController] = useState();
  const [stash, setStash] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const _controller = values.filter(value => value.json.meta.tags.includes('controller'))[0];
      const _stash = values.filter(value => value.json.meta.tags.includes('stash'))[0];

      setController(_controller);
      setStash(_stash);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  return (
    <Modal.Content>
      <Card>
        {
          stash && controller && <Bond controller={controller.json.address} stash={stash.json.address} {...props} />
        }
      </Card>
    </Modal.Content>
  );
}
