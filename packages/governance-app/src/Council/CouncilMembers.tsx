// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Vec } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { isUndefined } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Header, StackedHorizontal } from '@substrate/ui-components';
import { tryCatch2v } from 'fp-ts/lib/Either';
import React, { useContext, useEffect, useState } from 'react';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

export function CouncilMembers (): React.ReactElement {
  const { api, keyring } = useContext(AppContext);
  const [activeCouncil, setActiveCouncil] = useState<Vec<AccountId>>();

  useEffect(() => {
    const subscription = api.query.council.members<Vec<AccountId>>()
      .subscribe((activeCouncil) => {
        setActiveCouncil(activeCouncil);
      });

    return (): void => subscription.unsubscribe();
  }, [api.query.council]);

  return (
    <React.Fragment>
      <Header>Active Council ({activeCouncil && activeCouncil.length}) </Header>
      {
        activeCouncil && activeCouncil.map(accountId => {
          let name;

          tryCatch2v(
            () => keyring.getAccount(accountId),
            (e: any) => new Error(e.message)
          )
            .chain((pair) => tryCatch2v(
              () => {
                if (!isUndefined(pair)) {
                  name = pair.meta.name;
                }
                name = '';
                throw new Error('could not get meta from pair');
              },
              (e) => e as Error
            ));

          return (
            <Card height='120px' key={accountId.toString()}>
              <Card.Content>
                <StackedHorizontal>
                  <AddressSummary address={accountId.toString()} name={name} orientation='horizontal' size='medium' />
                </StackedHorizontal>
              </Card.Content>
            </Card>
          );
        })
      }
    </React.Fragment>
  );
}
