// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IS_PROD } from '../app/constants';

// References:
// * https://github.com/parity-js/shell
// * https://github.com/paritytech/fether
const CSP_CONFIG = {
  // Disallow mixed content
  blockAllMixedContent: 'block-all-mixed-content;',
  // Disallow framing and web workers.
  childSrc: "child-src 'none';",
  // FIXME - Only allow connecting to WSS and HTTPS servers.
  connectSrc: IS_PROD
    ? 'connect-src ws:;'
    // Also allow http in dev mode, for CRA
    : 'connect-src http: ws:;',
  // Fallback for missing directives.
  // Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
  //
  // Disallow everything as fallback by default for all CSP fetch directives.
  defaultSrc: "default-src 'none';",
  // Disallow fonts, we allow https because we are loading from Google Fonts (FIXME don't load from google)
  fontSrc: "font-src 'self' data: https:;",
  // Disallow submitting any forms
  formAction: "form-action 'none';",
  // Disallow framing.
  frameSrc: "frame-src 'none';",
  // Restrict images to only images from known sources
  imgSrc: "img-src 'self' data:;",
  // Disallow manifests.
  manifestSrc: "manifest-src 'none';",
  // Disallow media.
  mediaSrc: "media-src 'none';",
  // Disallow fonts and `<webview>` objects
  objectSrc: "object-src 'none';",
  // Disallow unknown scripts
  scriptSrc: "script-src 'self' 'unsafe-inline';",
  // Disallow stylesheets, we allow https because we are loading from Google Fonts (FIXME don't load from google)
  styleSrc: "style-src 'self' 'unsafe-inline' https:;",
  // Disallow workers, allow `blob:` for camera access if needed
  workerSrc: "worker-src 'none';"
};

export const CSP = Object.values(CSP_CONFIG).join(' ');
