// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { FadedText, FlexSegment, Header, Modal, SubHeader } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { map } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

interface Props extends RouteComponentProps {}

export function Claim (props: Props) {
  const [stash, setStash] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      setStash(values.filter(value => value.json.meta.isStash));
    });

    return () => accountsSub.unsubscribe();
  }, []);

  return (
    <Modal.Content>
      <Card.Group>
        <Card fluid>
          <Card.Header>
            <Header>SIGN ETH TRANSACTION</Header>
          </Card.Header>
          <Card.Content>
            <Header>Message</Header>
            <FlexSegment>
              <FadedText>Pay KSMs to the Kusama account: {stash && stash.json && stash.json.address}</FadedText>
            </FlexSegment>
            <SubHeader>Copy the above string and sign an Ethereum transaction with the account you used during the pre-sale.</SubHeader>
          </Card.Content>
        </Card>
      </Card.Group>
    </Modal.Content>
  );
}
