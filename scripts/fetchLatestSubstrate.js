// curl https://getsubstrate.io -sSf | bash

const fetch = require('node-fetch');
const { chmod, existsSync, writeFileSync } = require('fs');
const ncp = require('ncp');
const os = require('os');
const path = require('path');
const semver = require('semver');
const spawn = require('child_process').spawn;
const { promisify } = require('util');

const {
    substrate: { version: versionRequirement }
} = require('../packages/electron-app/package.json');

const exec = promisify(require('child_process').exec);
const fsChmod = promisify(chmod);
const pncp = promisify(ncp);

const HOME_DIR = os.homedir();
const ENDPOINT = 'https://getsubstrate.io';
const STATIC_DIRECTORY = path.join(
    '..',
    'packages',
    'electron-app',
    'static'
);
const BUNDLED_PATH = path.join(STATIC_DIRECTORY, '/substrate');
const PATH_TO_SUBSTRATE = `${HOME_DIR}/.cargo/bin/substrate`;

if (existsSync(BUNDLED_PATH)) {
    // Bundled Parity Substrate was found, we check if the version matches the minimum requirements
    getBinaryVersion(BUNDLED_PATH)
        .then(version => {
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
        .catch(e => {
            console.error(e);
            process.exit(1);
        });
} else {
    // Bundled Parity Substrate wasn't found, we download the latest version
    downloadSubstrate();
}

// Essentially runs this: https://github.com/paritytech/substrate#on-mac-and-ubuntu step by step.
// Only for OSX and Linux
function downloadSubstrate() {
    fetch(ENDPOINT)
        .then(r => r.text())
        .then(script => {
            writeFileSync('./getSubstrate.sh', script);
            // spawn a child process to run the script
            const getSubstrate = spawn('sh', ['./getSubstrate.sh', '--', '--fast']);
            // handle events as they come up
            getSubstrate.stdout.on('data', data => console.log(data.toString()));
            getSubstrate.stderr.on('data', error => console.log(error.toString()));
            getSubstrate.on('error', error => (console.log('script error with code => ', error.toString())));
            getSubstrate.on('exit', code => (console.log('process exited with code => ', code.toString())));

            // after the download completess
            getSubstrate.on('close', code => {
                // FIXME control flow depending on code
                console.log(`process ended with code: ${code}`);

                // copy the entire directory
                return pncp(PATH_TO_SUBSTRATE, BUNDLED_PATH)
                    .then(() => fsChmod(BUNDLED_PATH, 0o755))
                    .then(() => BUNDLED_PATH);
            });
        })
        .catch(e => console.log('Fatal error with getSubstrate script =>', e))
}

function getBinaryVersion(binaryPath) {
    return exec(`${binaryPath} --version`)
        .then(({ stdout, stderr }) => {
            if (stderr) throw new Error(stderr);
            return stdout.match(/\d+\.\d+\.\d+/)[0];
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
