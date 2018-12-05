import { ChainsInfo, Options } from './settingsDefaults';
export interface SettingsStruct {
    apiUrl: string;
    i18nLang: string;
    uiMode: string;
    uiTheme: string;
}
declare class Settings implements SettingsStruct {
    private _apiUrl;
    private _i18nLang;
    private _uiMode;
    private _uiTheme;
    constructor();
    readonly apiUrl: string;
    readonly i18nLang: string;
    readonly uiMode: string;
    readonly uiTheme: string;
    readonly availableChains: ChainsInfo;
    readonly availableNodes: Options;
    readonly availableLanguages: Options;
    readonly availableUIModes: Options;
    readonly availableUIThemes: Options;
    get(): SettingsStruct;
    set(settings: Partial<SettingsStruct>): void;
}
export declare const settings: Settings;
export {};
