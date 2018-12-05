"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("store"));
const settingsDefaults_1 = require("./settingsDefaults");
class Settings {
    constructor() {
        const settings = store_1.default.get('settings') || {};
        // FIXME Here we have the defaults for BBQ, swap to Polkadot as soon as poc-3 is there
        // FIXME WS_URL first, then substrate-rpc
        this._apiUrl = settings.apiUrl || settingsDefaults_1.ENDPOINTS[0].value || process.env.WS_URL;
        this._i18nLang = settings.i18nLang || settingsDefaults_1.LANGUAGES[0].value;
        this._uiMode = settings.uiMode || process.env.UI_MODE || settingsDefaults_1.UIMODES[0].value;
        this._uiTheme = settings.uiTheme || process.env.UI_THEME || settingsDefaults_1.UITHEMES[0].value;
    }
    get apiUrl() {
        return this._apiUrl;
    }
    get i18nLang() {
        return this._i18nLang;
    }
    get uiMode() {
        return this._uiMode;
    }
    get uiTheme() {
        return this._uiTheme;
    }
    get availableChains() {
        return settingsDefaults_1.CHAINS;
    }
    get availableNodes() {
        return settingsDefaults_1.ENDPOINTS;
    }
    get availableLanguages() {
        return settingsDefaults_1.LANGUAGES;
    }
    get availableUIModes() {
        return settingsDefaults_1.UIMODES;
    }
    get availableUIThemes() {
        return settingsDefaults_1.UITHEMES;
    }
    get() {
        return {
            apiUrl: this._apiUrl,
            i18nLang: this._i18nLang,
            uiMode: this._uiMode,
            uiTheme: this._uiTheme
        };
    }
    set(settings) {
        this._apiUrl = settings.apiUrl || this._apiUrl;
        this._i18nLang = settings.i18nLang || this._i18nLang;
        this._uiMode = settings.uiMode || this._uiMode;
        this._uiTheme = settings.uiTheme || this._uiTheme;
        store_1.default.set('settings', this.get());
    }
}
exports.settings = new Settings();
