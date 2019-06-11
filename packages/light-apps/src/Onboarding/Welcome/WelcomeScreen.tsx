// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Intro, ChooseCreationOption, SetupNominator } from './index';

interface Props extends RouteComponentProps { }

export function WelcomeScreen (props: Props) {
  const { system } = useContext(AppContext);
  const [difficulty, selectDifficulty] = useState();
  const [step, setStep] = useState(1);

  const createIdle = () => {
    props.history.push('/create');
  };

  const setupNominator = () => {
    setStep(3);
  };

  const onSelectMode = ({ currentTarget: { dataset: { mode } } }: React.MouseEvent<HTMLElement>) => {
    selectDifficulty(mode);
    setStep(2);
  };

  switch (step) {
    case 1:
      return <Intro chain={system.chain} onSelectMode={onSelectMode} />;
    case 2:
      return <ChooseCreationOption difficulty={difficulty} setupNominator={setupNominator} createIdle={createIdle} />;
    case 3:
      return <SetupNominator />;
    default:
      return <Intro chain={system.chain} onSelectMode={onSelectMode} />;
  }
}
