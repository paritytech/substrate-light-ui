/// <reference types="react-scripts" />

// Packages that don't have typings yet.
declare module 'tachyons-components';

// Extensions inject `injectedWeb3`
interface Window {
  injectedWeb3?: Record<string, InjectedWindowProvider>;
}
