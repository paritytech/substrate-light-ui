export declare type ChainsInfo = Array<{
    name: string;
    chainId: number;
    decimals: number;
    unit: string;
}>;
export declare type Options = Array<{
    disabled?: boolean;
    text: string;
    value: string;
}>;
declare const CHAINS: ChainsInfo;
declare const ENDPOINTS: Options;
declare const LANGUAGES: Options;
declare const UIMODES: Options;
declare const UITHEMES: Options;
export { CHAINS, ENDPOINTS, LANGUAGES, UIMODES, UITHEMES };
