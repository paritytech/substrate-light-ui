"use strict";
// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const i18next_xhr_backend_1 = __importDefault(require("i18next-xhr-backend"));
const react_i18next_1 = require("react-i18next");
i18next_1.default
    .use(i18next_xhr_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.reactI18nextModule)
    .init({
    backend: {
        loadPath: 'locales/{{lng}}/{{ns}}.json'
    },
    debug: false,
    defaultNS: 'ui',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    ns: ['ui'],
    react: {
        wait: true
    }
});
exports.default = i18next_1.default;
