// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { BoldText, CopyButton, FlexSegment, Header, Margin, Modal, SubHeader, TextArea, StyledNavButton, StyledLinkButton, StackedHorizontal } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { map } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

interface Props extends RouteComponentProps {}

export function Claim (props: Props) {
  const { history } = props;

  const [messageToSign, setMessageToSign] = useState<string>('');

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const stash = values.filter(value =>
        fromNullable(value.json.meta.tags)
          .map(tags => tags.includes('stash'))
          .getOrElse(undefined)
      )[0];

      const messageToSign = fromNullable(stash)
                            .map(stash => `Pay KSMs to the Kusama account: ${stash.json.address}`)
                            .getOrElse('');
      setMessageToSign(messageToSign);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  const handleSubmitClaim = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
  };

  const renderWithRaw = () => {
    return (
      <Card.Content>
        <SubHeader>Copy the below string and sign an Ethereum transaction with the account you used during the pre-sale.</SubHeader>
        <Margin top />
        <FlexSegment width={'100%'}>
          {
            messageToSign && (
                <React.Fragment>
                  <BoldText>{messageToSign}</BoldText>
                  <CopyButton value={messageToSign} />
                </React.Fragment>
              )
          }
        </FlexSegment>
      </Card.Content>
    );
  };

  return (
    <React.Fragment>
      <Modal.Content>
        <Card.Group itemsPerRow={2} stackable>
          <Card>
            <Card.Header>
              <Header>SIGN ETH TRANSACTION</Header>
            </Card.Header>
            { renderWithRaw() }
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
          <StyledNavButton onClick={handleSubmitClaim}>Next</StyledNavButton>
        </StackedHorizontal>
      </Modal.Actions>
    </React.Fragment>
  );
}
