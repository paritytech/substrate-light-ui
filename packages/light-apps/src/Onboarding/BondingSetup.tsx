// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';
import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Bond } from '@substrate/accounts-app';
import { AppContext } from '@substrate/context';
import { FadedText, Header, Icon, Message, Modal, Stacked, substrateLightTheme } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map, take } from 'rxjs/operators';

type Props = RouteComponentProps

export function BondingSetup (props: Props): React.ReactElement {
  const { api } = useContext(AppContext);
  const [controller, setController] = useState();
  const [stash, setStash] = useState();
  const [stashNoBalance, setStashNoBalance] = useState<boolean>(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const _controller = values.filter(value => value.json.meta.tags && value.json.meta.tags.includes('controller'))[0];
      const _stash = values.filter(value => value.json.meta.tags && value.json.meta.tags.includes('stash'))[0];

      setController(_controller);
      setStash(_stash);
    });

    return (): void => accountsSub.unsubscribe();
  }, []);

  useEffect(() => {
    if (!stash) {
      return;
    }

    const stashBalSub = api.query.balances.freeBalance<Balance>(stash.json.address)
      .pipe(
        take(1)
      ).subscribe((balance) => {
        if (balance.gt(new BN(0))) {
          setStashNoBalance(false);
        }
      });

    return (): void => stashBalSub.unsubscribe();
  }, [api, stash]);

  const renderControllerNotFound = (): React.ReactElement => {
    return (
      <Stacked>
        <Header>Uh oh...</Header>
        <Icon color={substrateLightTheme.robinEggBlue} name='qq' size='massive' />
        <Message error>We could not find a suitable account to use as a Controller. Please go back and create one before bonding.</Message>
        <FadedText> You can also skip this step and finish bonding later. </FadedText>
      </Stacked>
    );
  };

  const renderStashNotFound = (): React.ReactElement => {
    return (
      <Stacked>
        <Header>Uh oh...</Header>
        <Icon color={substrateLightTheme.grey} name='qq' size='massive' />
        <Message>We could not find a suitable account to use as a Stash. Please go back and create one before bonding.</Message>
        <FadedText> You can also skip this step and finish bonding later. </FadedText>
      </Stacked>
    );
  };

  const renderStashNoBalance = (): React.ReactElement => {
    return (
      <Stacked>
        <Header>Your Stash account has no balance!</Header>
        <Icon color={substrateLightTheme.grey} name='qq' size='massive' />
        <Message>You will need to some funds before bonding. Please go back and claim some or skip this step and try again later after refreshing your funds.</Message>
      </Stacked>
    );
  };

  return (
    <Modal.Content>
      {
        !stash
          ? renderStashNotFound()
          : !controller
            ? renderControllerNotFound()
            : stashNoBalance
              ? renderStashNoBalance()
              : <Bond controller={controller.json.address} stash={stash.json.address} {...props} />
      }
    </Modal.Content>
  );
}
