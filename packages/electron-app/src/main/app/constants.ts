// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * The port the substrate node is running on
 */
export const DEFAULT_HTTP_PORT = '9933';

/**
 * Production mode or not
 */
export const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * `yarn start` in `./packages/light-apps`
 */
export const REACT_DEV_LOCALHOST = 'http://localhost:3000';

/**
 * The hostname the substrate node is running on
 */
export const TRUSTED_LOOPBACK = '127.0.0.1';
