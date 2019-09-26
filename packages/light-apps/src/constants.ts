// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const ONBOARDING_STEPS = [
  'welcome',
  'stash',
  'controller',
  'claim',
  'bond',
  'nominate'
];

export const tutorialSteps = [
  {
    target: '.add-account',
    content: 'Add more accounts from here. You will want unlock at least a stash and controller account here in order to beging nominating. Read more about it here: '
  },
  {
    target: '.accounts-overview',
    content: 'Get a quick overview of all your accounts here.'
  },
  {
    target: '.bonding',
    content: 'View your bonding options on this page. You should have at least two accounts unlocked and at least one with some funds in it.'
  },
  {
    target: '.browse-validators',
    content: 'You can view a list of all the current validators here.'
  },
  {
    target: '.add-to-cart',
    content: 'Add validators you wish to validate to your shopping ballot.'
  },
  {
    target: '.confirm-nomination',
    content: 'Confirm nomination!'
  }
];
