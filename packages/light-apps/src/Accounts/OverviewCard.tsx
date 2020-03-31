// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/context';
import {
  AddressSummary,
  Card,
  Icon,
  Margin,
  StackedHorizontal,
  StyledLinkButton,
} from '@substrate/ui-components';
import React, { useContext, useState } from 'react';

interface Props {
  address: string;
  name?: string;
}

export function AccountsOverviewCard(props: Props): React.ReactElement {
  const { address, name } = props;
  const { api } = useContext(ApiContext);
  const [showDetails, setShowDetails] = useState(false);

  const handleBackup = (): void => {
    window.alert('FIXME handleBackup');
  };

  function handleForget(): void {
    window.alert('FIXME handleForget');
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
