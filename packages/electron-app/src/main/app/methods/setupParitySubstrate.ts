// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ParitySubstrate from '../paritySubstrate';

function setupParitySubstrate(sluiApp: any) {
  // Run Parity Substrate if not running and requested
  return new ParitySubstrate(sluiApp.win);
}

export default setupParitySubstrate;
