// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StyledNavButton, WithSpaceAround } from '@substrate/ui-components';
import H from 'history';
import React, { useState } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import { FinalConfirmation } from './FinalConfirmation';
import { SelectNominateWith } from './SelectNominateWith';

interface Props {
  disabled?: boolean;
  history: H.History;
  nominees: string[];
}

// TODO: p3 refactor all this to smaller components
export function ConfirmNominationDialog (props: Props) {
  const { disabled, history, nominees } = props;

  const [nominateWith, setNominateWith] = useState();

  const handleSelectNominateWith = (account: string | null) => {
    setNominateWith(account);
  };

  return (
    <Modal
      closeOnDimmerClick
      closeOnEscape
      trigger={<StyledNavButton disabled={disabled}> Nominate </StyledNavButton>}
    >
      <WithSpaceAround>
        {
          nominateWith
            ? <FinalConfirmation handleSelectNominateWith={handleSelectNominateWith} history={history} nominees={nominees} nominateWith={nominateWith} />
            : <SelectNominateWith handleSelectNominateWith={handleSelectNominateWith} history={history} />
        }
      </WithSpaceAround>
    </Modal>
  );
}
