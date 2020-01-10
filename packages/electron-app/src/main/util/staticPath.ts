// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app } from 'electron';
import path from 'path';

/**
 * Get the path to the `static` folder.
 * This is a temporary hack, waiting for the 2 issues to be fixed.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 * @see https://github.com/electron-userland/electron-webpack/issues/157
 */
export const staticPath = app.isPackaged
  ? __dirname.replace(/app\.asar$/, 'static')
  : path.join(process.cwd(), 'static');

export const bundledPath = path.join(staticPath, 'substrate');
