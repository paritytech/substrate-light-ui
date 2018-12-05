import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
import { BareProps } from './types';
import React from 'react';
declare type Props = BareProps & {
    api?: RpcRxInterface;
    provider?: ProviderInterface;
    url?: string;
};
export declare function createApp(App: React.ComponentType<BareProps>, { api, className, provider, style, url }?: Props, rootId?: string): void;
export * from './settings';
export * from './types';
