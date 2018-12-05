import { TranslationFunction } from 'i18next';
import { RpcRxInterface } from '@polkadot/rpc-rx/types';
export declare type BareProps = {
    className?: string;
    style?: {
        [index: string]: any;
    };
};
export declare type I18nProps = BareProps & {
    t: TranslationFunction;
};
export declare type BaseContext = {
    api: RpcRxInterface;
    router: {
        route: {
            location: Location;
        };
    };
};
export declare type BitLength = 8 | 16 | 32 | 64 | 128 | 256;
