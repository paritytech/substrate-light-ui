// // Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// // This software may be modified and distributed under the terms
// // of the Apache-2.0 license. See the LICENSE file for details.

// import { DerivedStaking } from '@polkadot/api-derive/types';
// import { AccountId, Option } from '@polkadot/types';
// import { AppContext } from '@substrate/ui-common/src';
// import localforage from 'localforage';
// import React, { useContext, useState, useReducer } from 'react';
// import { Subscription, Observable } from 'rxjs';

// interface Props {
//   children: React.ReactNode;
// }

// // type DerivedStakingMap = {
// //   accountId: AccountId,
// //   derivedStaking: DerivedStaking
// // };

// // type DerivedStakingMapArray = DerivedStakingMap[];

// export interface IStakingContext {
//   // derivedStakingMapArray: DerivedStakingMapArray;
//   fetchStakingInfo: (account: AccountId) => void;
//   fetchSessionValidators: () => void;
//   fetchValidatorListStakingInfo: (validators: AccountId[]) => void;
// }

// export const StakingContext: React.Context<IStakingContext> = React.createContext({} as IStakingContext);

// // (api.derive.staking.controllers() as unknown as Observable<any>),
// // (api.query.staking.recentlyOffline() as unknown as Observable<any>),
// // (api.query.session.validators() as unknown as Observable<AccountId[]>)

// // search if key exists in derivedStakingMapArray. Can't sort by address so best we can do is O(N) which is fine, this list shouldn't exceed length 100 or so.
// // const stakingMapReducer = (derivedStakingMapArray: DerivedStakingMapArray, action: any) => {
// //   switch (action.type) {
// //     case 'ADD':
// //       if (!derivedStakingMapArray) {
// //         return [{ accountId: action.accountId, derivedStaking: action.derivedStaking }];
// //       } else {
// //         return derivedStakingMapArray.map((derivedStakingMap) => {
// //         // if it exists, replace the record
// //           if (derivedStakingMap.accountId === action.accountId) {
// //             return [
// //               ...derivedStakingMapArray,
// //               {
// //                 accountId: action.accountId,
// //                 derivedStaking: action.derivedStaking
// //               }
// //             ];
// //           } else {
// //             return derivedStakingMapArray.concat({ accountId: action.accountId, derivedStaking: action.derivedStaking });
// //           }
// //         });
// //       }
// //     default:
// //       return;
// //   }
// // };

// export function StakingContextProvider (props: Props) {
//   const [nominationProps, setNominationProps] = useState();

//   // const fetchStakingInfo = (accountId: AccountId) => {
//   //   const stakingSubscription: Subscription = (api.derive.staking.info(accountId) as Observable<DerivedStaking>)
//   //     .subscribe((derivedStaking) => {
//   //       // dispatch({ accountId, derivedStaking });
//   //       localforage.setItem(accountId.toString(), derivedStaking)
//   //         .then(() => stakingSubscription.unsubscribe())
//   //         .catch(err => console.error(err));
//   //     });
//   // };

//   // const fetchValidatorListStakingInfo = (validators: AccountId[]) => {
//   //   validators.map((validator: AccountId) => {
//   //     const stakingSubscription: Subscription = (api.derive.staking.info(validator.toString()) as Observable<DerivedStaking>)
//   //       .subscribe((derivedStaking) => {
//   //         localforage.setItem(validator.toString(), derivedStaking)
//   //           .then(() => stakingSubscription.unsubscribe())
//   //           .catch(err => console.error(err));
//   //       });
//   //   });
//   // };

//   // const fetchSessionValidators = () => {
//   //   const validatorSubscription: Subscription = (api.derive.staking.controllers() as unknown as Observable<[AccountId[], Option<AccountId>[]]>)
//   //     .subscribe((allStashesAndControllers) => {
//   //       localforage.setItem('allStashesAndControllers', allStashesAndControllers)
//   //         .then(() => validatorSubscription.unsubscribe())
//   //         .catch(err => console.error(err));
//   //     });
//   // };

//   return (
//     <StakingContext.Provider value={{ nominationProps }}>
//       {props.children}
//     </StakingContext.Provider>
//   );
// }
