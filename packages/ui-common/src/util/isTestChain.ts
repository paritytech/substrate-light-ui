// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const TEST_CHAINS = ['Development', 'Local Testnet'] as const;
type TestChain = typeof TEST_CHAINS[number]

export function isTestChain (chain?: string): chain is TestChain {
  if (!chain) {
    return false;
  }

  return (TEST_CHAINS).includes(chain as TestChain);
}
