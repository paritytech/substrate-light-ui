/// <reference types="react" />
declare const _default: <P extends import("react-i18next").WithNamespaces>(component: import("react").ComponentType<P>) => import("react").ComponentType<Pick<P, Exclude<keyof P, "t" | "i18nOptions" | "i18n" | "defaultNS" | "reportNS" | "lng" | "tReady" | "initialI18nStore" | "initialLanguage">>>;
export default _default;
