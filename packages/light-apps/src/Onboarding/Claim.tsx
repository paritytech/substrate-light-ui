// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { BoldText, CopyButton, FlexSegment, Header, Margin, Modal, SubHeader, TextArea, StyledNavButton, StyledLinkButton, StackedHorizontal } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { map } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';
import { fromNullable } from 'fp-ts/lib/Option';

interface Props extends RouteComponentProps {}

export function Claim (props: Props) {
  const { history } = props;

  const [stash, setStash] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const stash = values.filter(value => value.json.meta.tags.includes('stash'))[0];
      setStash(stash);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <Modal.Content>
        <Card.Group itemsPerRow={2} stackable>
          <Card>
            <Card.Header>
              <Header>SIGN ETH TRANSACTION</Header>
            </Card.Header>
            <Card.Content>
            <SubHeader>Copy the below string and sign an Ethereum transaction with the account you used during the pre-sale.</SubHeader>
              <Margin top />
              <FlexSegment width={'100%'}>
                {
                  fromNullable(stash)
                    .map(stash => stash.json)
                    .map(json => json.address)
                    .map(address => (
                      <React.Fragment>
                        <BoldText>Pay KSMs to the Kusama account: {address}</BoldText>
                        <CopyButton value={`Pay KSMs to the Kusama account: ${address}`} />
                      </React.Fragment>
                    ))
                    .getOrElse(<div></div>)
                }
              </FlexSegment>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
                <Header>Transaction Signature</Header>
              </Card.Header>
              <Card.Content>
                <SubHeader>Paste the resulting signature object from the above transaction below:</SubHeader>
                <TextArea />
              </Card.Content>
          </Card>
        </Card.Group>
      </Modal.Content>
      <Modal.Actions>
        <StackedHorizontal>
          <StyledLinkButton onClick={() => history.push('/onboarding/bond')}>Skip</StyledLinkButton>
          <StyledNavButton >Next</StyledNavButton>
        </StackedHorizontal>
      </Modal.Actions>
    </React.Fragment>
  );
}
