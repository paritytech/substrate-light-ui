// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IS_PROD } from './constants';

/* eslint-disable */
// References:
// * https://github.com/parity-js/shell
// * https://github.com/paritytech/fether
const CSP_CONFIG = {
  // Disallow mixed content
  blockAllMixedContent: 'block-all-mixed-content;',
  // Disallow framing and web workers.
  // tslint:disable-next-line:quotemark
  childSrc: "child-src 'none';",
  // FIXME - Only allow connecting to WSS and HTTPS servers.
  connectSrc: 'connect-src http: ws:;',
  // Fallback for missing directives.
  // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
  //
  // Disallow everything as fallback by default for all CSP fetch directives.
  defaultSrc: "default-src 'none';",
  // Disallow fonts.
  fontSrc: "font-src 'self';", // Additionally used in Parity-JS Shell `'self' data: https:`
  // Disallow submitting any forms
  formAction: "form-action 'none';",
  // Disallow framing.
  frameSrc: "frame-src 'none';",
  imgSrc: !IS_PROD
    ? // Only allow HTTPS for images. Token provider logos must be https://
      // Allow `data:` `blob:`.
      "img-src 'self' 'unsafe-inline' file: data: blob: https:;"
    : // Only allow HTTPS for images. Token provider logos must be https://
      // Allow `data:` `blob:`.
      "img-src 'unsafe-inline' file: data: blob: https:;", // Additionally used in Parity-JS Shell `'self'`
  // Disallow manifests.
  manifestSrc: "manifest-src 'none';",
  // Disallow media.
  mediaSrc: "media-src 'none';",
  // Disallow fonts and `<webview>` objects
  objectSrc: "object-src 'none';",
  // Disallow prefetching.
  prefetchSrc: "prefetch-src 'none';",
  scriptSrc: !IS_PROD
    ? // Only allow `http:` and `unsafe-eval` in dev mode (required by create-react-app)
      "script-src 'self' file: http: blob: 'unsafe-inline' 'unsafe-eval';"
    : "script-src file: 'unsafe-inline';",
  styleSrc: !IS_PROD
    ? "style-src 'self' 'unsafe-inline' file: blob:;" // Additionally used in Parity-JS Shell `data: https:`
    : "style-src unsafe-inline' file: blob:;", // Additionally used in Parity-JS Shell `data: https:`
  // Allow `blob:` for camera access (worker)
  workerSrc: 'worker-src blob:;' // Additionally used in Parity-JS Shell `'self' https:`
};
/* eslint-enable */

const CSP = Object.values(CSP_CONFIG).join(' ');

export { CSP };
