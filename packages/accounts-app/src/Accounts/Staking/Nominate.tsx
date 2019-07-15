// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Final step is to select a validator. Can opt to skip and come back this if they so choose.

// Show a list of current validators and sort by times reported offline.

// Explain that validators get slashed when they misbehave. Misbehaving is characterized by:
// 1. Reported offline
// 2. Running malicious code

// on confirm, redirect to thedetailed balances page, which should now show the stash and controllers
// as "linked" with the correct bond, plus nominating the correct validator

// should someone who goes to the staking tab from a stash already bonded, they should be directed straight to 
// validator selection tab. You can nominate multiple validators from the same stash/controller pair.