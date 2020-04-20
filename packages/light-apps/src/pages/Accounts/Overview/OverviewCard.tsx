// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRxContext } from '@substrate/context';
import {
  AddressSummary,
  Card,
  Icon,
  Margin,
  StackedHorizontal,
  StyledLinkButton,
} from '@substrate/ui-components';
import React, { useContext, useState } from 'react';

import { InjectedContext } from '../../../components/context';
import { assertIsDefined } from '../../../util/assert';

interface Props {
  address: string;
  name?: string;
}

export function AccountsOverviewCard(props: Props): React.ReactElement {
  const { address, name } = props;

  const { api } = useContext(ApiRxContext);
  const { messaging } = useContext(InjectedContext);

  const [showDetails, setShowDetails] = useState(false);

  const handleBackup = (): void => {
    assertIsDefined(
      messaging,
      "We wouldn't be showing a backup button if no injected messaging. qed."
    );

    const password = window.prompt('Type the password for this account:');
    if (password) {
      messaging
        .exportAccount(address, password)
        .then(({ exportedJson }) => {
          const element = document.createElement('a');
          element.href = `data:text/plain;charset=utf-8,${exportedJson}`;
          element.download = `${
            JSON.parse(exportedJson).meta.name
          }_exported_account_${Date.now()}.json`;
          element.click();
        })
        .catch(console.error);
    }
  };

  function handleForget(): void {
    assertIsDefined(
      messaging,
      "We wouldn't be showing a forget button if no injected messaging. qed."
    );

    if (window.confirm(`Forget account ${address}?`)) {
      messaging.forgetAccount(address).catch(console.error);
    }
  }

  function handleShowDetails(): void {
    setShowDetails(!showDetails);
  }

  return (
    <>
      <Card height='80%' raised>
        <Card.Content textAlign='right'>
          <AddressSummary
            address={address}
            alignItems='center'
            api={api}
            detailed={showDetails}
            justifyContent='center'
            name={name}
            orientation='horizontal'
            size='small'
          />
          <Margin bottom />

          <StackedHorizontal>
            <StyledLinkButton onClick={handleShowDetails}>
              <Icon name={showDetails ? 'up arrow' : 'down arrow'} />
              {showDetails ? 'Hide Details' : 'Show Details'}
            </StyledLinkButton>
            {showDetails && (
              <>
                <StyledLinkButton onClick={handleForget}>
                  <Icon name='remove' />
                  Forget
                </StyledLinkButton>
                <StyledLinkButton onClick={handleBackup}>
                  <Icon name='arrow alternate circle down' />
                  Backup
                </StyledLinkButton>
              </>
            )}
          </StackedHorizontal>
        </Card.Content>
      </Card>
    </>
  );
}
