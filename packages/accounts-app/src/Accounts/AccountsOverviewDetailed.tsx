
import { AccountId, Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, FlexItem, Modal, StackedHorizontal, StyledLinkButton } from '@substrate/ui-components';
import React, { useEffect, useState, useContext } from 'react';
import { Observable, Subscription } from 'rxjs';

interface Props {
  address: string,
  name: string
}

export function AccountsOverviewDetailed (props: Props) {
  const { address, name } = props;  
  const { api } = useContext(AppContext);
  const [controllers, setControllers] = useState();

  useEffect(() => {
    let subscription: Subscription = 
      (api.derive.staking.controllers(address) as unknown as Observable<[AccountId[], Option<AccountId>[]]>)
        .subscribe(setControllers)
  
    return () => subscription.unsubscribe();
  }, [api]);

  console.log(controllers);

  return (
    <Modal trigger={<StyledLinkButton>Show More</StyledLinkButton>}>
      <Modal.Header>Details About: {address}</Modal.Header>
      <Modal.Content image>
        <StackedHorizontal>
          <FlexItem><AddressSummary address={address} detailed name={name} size='medium' /></FlexItem>
          <FlexItem>
            <Modal.Description>
              <p>Controllers: {controllers && controllers.length}</p>
              <ul>
              </ul>
            </Modal.Description>
          </FlexItem>
        </StackedHorizontal>
      </Modal.Content>
    </Modal>
  );
}
