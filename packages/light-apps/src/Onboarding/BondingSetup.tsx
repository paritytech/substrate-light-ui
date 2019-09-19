// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bond } from '@substrate/accounts-app';
import accounts from '@polkadot/ui-keyring/observable/accounts';
// import { CreateResult } from '@polkadot/ui-keyring/types'
import { FadedText, Header, Icon, Message, Modal, Stacked, substrateLightTheme } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

interface Props extends RouteComponentProps { }

export function BondingSetup (props: Props) {
  const [controller, setController] = useState();
  const [stash, setStash] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const _controller = values.filter(value => value.json.meta.tags && value.json.meta.tags.includes('controller'))[0];
      const _stash = values.filter(value => value.json.meta.tags && value.json.meta.tags.includes('stash'))[0];

      setController(_controller);
      setStash(_stash);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  const renderControllerNotFound = () => {
    return (
      <Stacked>
        <Header>Uh oh...</Header>
        <Icon color={substrateLightTheme.robinEggBlue} name='qq' size='massive' />
        <Message error>We could not find a suitable account to use as a Controller. Please go back and create one before bonding.</Message>
        <FadedText> You can also skip this step and finish bonding later. </FadedText>
      </Stacked>
    );
  };

  const renderStashNotFound = () => {
    return (
      <Stacked>
        <Header>Uh oh...</Header>
        <Icon color={substrateLightTheme.grey} name='qq' size='massive' />
        <Message>We could not find a suitable account to use as a Stash. Please go back and create one before bonding.</Message>
        <FadedText> You can also skip this step and finish bonding later. </FadedText>
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
            : <Bond controller={controller.json.address} stash={stash.json.address} {...props} />
    }
    </Modal.Content>
  );
}
