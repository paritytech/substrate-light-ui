// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app } from 'electron';
import fs from 'fs';
import { createLogger, format, transports } from 'winston';

// Create userData folder if it doesn't exist
try {
  fs.statSync(app.getPath('userData'));
} catch (e) {
  fs.mkdirSync(app.getPath('userData'));
}

export const logger = createLogger({
  transports: [
    // Print to console
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(
          (info) => `[${info.timestamp}] ${info.level} ${info.message}`
        )
      ),
      level: 'debug',
    }),
    // And save to file
    new transports.File({
      filename: `${app.getPath('userData')}/slui.log`,
      format: format.combine(format.timestamp(), format.json()),
      level: 'debug',
    }),
  ],
});
