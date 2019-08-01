// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
Show a list of current validators.

Explain that validators get slashed when they misbehave. Misbehaving is characterized by:
1. Reported offline
2. Running malicious code
3. Double Equivocations

Enhancements TODO:
1. Search bar for validators by their address
2. Filter by just my nominations
3. Filter by Validator preference of their service fee
4. Sort Validators by their Nominators count.
5. View detailed visualizations about a validator
  a. Offline reports
  b. Previous slashing events
  c. Risk to reward prediction https://github.com/paritytech/substrate-light-ui/issues/469

on confirm, redirect to the detailed balances page, which should now show the stash and controllers as "linked" with the correct bond, plus nominating the correct validator
*/

export * from './ValidatorsList';
