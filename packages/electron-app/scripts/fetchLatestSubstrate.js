/* eslint-disable @typescript-eslint/no-var-requires */

const { existsSync } = require('fs');
const path = require('path');
const semver = require('semver');
const { promisify } = require('util');

const {
  substrate: { version: versionRequirement },
} = require('../package.json');

const exec = promisify(require('child_process').exec);

const STATIC_DIRECTORY = path.join('..', 'static');
const BUNDLED_PATH = path.join(STATIC_DIRECTORY, '/substrate');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getBinaryVersion(binaryPath) {
  return exec(`${binaryPath} --version`)
    .then(({ stdout, stderr }) => {
      if (stderr) throw new Error(stderr);
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      return stdout.match(/\d+\.\d+\.\d+/)[0];
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function downloadSubstrate() {
  console.error(
    '`downloadSubstrate()` unimplemented. See https://github.com/paritytech/substrate-light-ui/issues/313.'
  );
  console.error(
    `As a workaround, please put manually the substrate binary in ${path.resolve(
      BUNDLED_PATH
    )}`
  );
}

if (existsSync(BUNDLED_PATH)) {
  // Bundled Parity Substrate was found, we check if the version matches the minimum requirements
  getBinaryVersion(BUNDLED_PATH)
    .then((version) => {
      console.log('Substrate version -> ', version);

      if (!version) {
        console.log("Couldn't get bundled Parity Substrate version.");
        return downloadSubstrate();
      }

      if (!semver.satisfies(version, versionRequirement)) {
        console.log(
          'Bundled Parity Substrate %s is older than required version %s',
          version,
          versionRequirement
        );
        return downloadSubstrate();
      } else {
        console.log(
          'Bundled Parity Substrate %s matches required version %s',
          version,
          versionRequirement
        );
      }
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} else {
  // Bundled Parity Substrate wasn't found, we download the latest version
  downloadSubstrate();
}
