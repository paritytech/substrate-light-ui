// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Image, Modal, StyledNavButton, WithSpaceAround, substrateLightTheme } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router';

type Props = RouteComponentProps;

export function Welcome (props: Props): React.ReactElement {
  const { history } = props;

  const navToCreateStash = (): void => {
    history.push('/onboarding/stash');
  };

  return (
    <WithSpaceAround>
      <Modal.Content>
        <Image src={`${process.env.PUBLIC_URL}/Kusama-expect-chaos.png`} size='large' />
      </Modal.Content>
      <Modal.Actions>
        <StyledNavButton color={substrateLightTheme.black} onClick={navToCreateStash}> Get Started </StyledNavButton>
      </Modal.Actions>
    </WithSpaceAround>
  );
}
