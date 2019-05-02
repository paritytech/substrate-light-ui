// curl https://getsubstrate.io -sSf | bash

const { chmod, existsSync, writeFile } = require('fs');
const crypto = require('crypto');
const download = require('download');
const fetch = require('node-fetch');
const path = require('path');
const { promisify } = require('util');
const semver = require('semver');

// TODO: figure out if there are version requirements???
// const {
//     parity: { version: versionRequirement }
// } = require('../packages/electron-app/package.json');

const exec = promisify(require('child_process').exec);
var spawn = require('child_process').spawn;
const fsChmod = promisify(chmod);
const fsWriteFile = promisify(writeFile);

function getOs() {
    if (process.argv.includes('--win')) {
        return 'windows';
    }
    if (process.argv.includes('--mac')) {
        return 'darwin';
    }
    if (process.argv.includes('--linux')) {
        return 'linux';
    }

    switch (process.platform) {
        case 'win32':
            return 'windows';
        case 'darwin':
            return 'darwin';
        default:
            return 'linux';
    }
}

const userOs = getOs();
// Need to handle Windows separately
const ENDPOINT = userOs === 'darwin' || userOs === 'linux' ? 'https://getsubstrate.io' : null;
const RUST_ENDPOINT = 'https://sh.rustup.rs';

const STATIC_DIRECTORY = path.join(
    '..',
    'packages',
    'electron-app',
    'static'
);

// FIXME: only relevant for the version requirements check
const foundPath = [
    path.join(STATIC_DIRECTORY, 'substrate'),
    path.join(STATIC_DIRECTORY, 'substrate.exe')
].find(existsSync);

downloadSubstrate();

// Essentially runs this: https://github.com/paritytech/substrate#on-mac-and-ubuntu step by step.
// Only for OSX and Linux
function downloadSubstrate() {
    const curl = spawn('curl https://getsubstrate.io', ['-sSf']);

    curl
        .on('data', (data) => {
            console.log(data);
        })
        .on('exit', (code) => {
            console.log('child process exited with code ' + code.toString());
        })
        .on('error', (error) => {
            console.log('Error: ' + error);
        })
}


// function downloadSubstrate() {
//     return (
//         // First grab rust and update to nightly
//         exec()
//             // exec the rustup scripts
//             .then(() => {
//                 console.log('Running rustup update nightly...');
//                 exec('rustup update nightly');
//             })
//             .then(() => {
//                 console.log('Running rustup target add wasm...');
//                 exec('rustup target add wasm32-unknown-unknown --toolchain nightly');
//             })
//             .then(() => {
//                 console.log('Running rustup update stable...');
//                 exec('rustup update stable')
//             })
//             .then(() => {
//                 console.log('Running cargo install wasm-gc...');
//                 exec('cargo install --git https://github.com/alexcrichton/wasm-gc')
//             }).then(() => {
//                 if (userOs === 'darwin') {
//                     // For OSX, Homebrew the remaining dependencies
//                     exec('brew install cmake pkg-config openssl git llvm')
//                 } else {
//                     // For Linux, apt-get
//                     exec('sudo apt install cmake pkg-config libssl-dev git clang libclang-dev')
//                 }
//             }).then(() => {
//                 // Then grab Substrate source code and build it
//                 console.log(
//                     'Downloading Parity Substrate %s... (%s)',
//                     version,
//                     downloadUrl
//                 );
//             })
//             .catch(err => console.log('Something went wrong', err))
//         );
//     }
    //             return download(downloadUrl).then(data => {
    //                 const actualChecksum = crypto
    //                     .createHash('sha256')
    //                     .update(data)
    //                     .digest('hex');

    //                 if (expectedChecksum !== actualChecksum) {
    //                     throw new Error(
    //                         `Parity Substrate checksum mismatch: expecting ${expectedChecksum}, got ${actualChecksum}.`
    //                     );
    //                 }

    //                 // Write to file and set a+x permissions
    //                 const destinationPath = path.join(STATIC_DIRECTORY, name);

    //                 return fsWriteFile(destinationPath, data)
    //                     .then(() => fsChmod(destinationPath, 0o755)) // https://nodejs.org/api/fs.html#fs_fs_chmod_path_mode_callback
    //                     .then(() => destinationPath);
    //             });
    //         })
    //         .then(getBinaryVersion)
    //         .then(bundledVersion =>
    //             console.log(
    //                 `Success: bundled Parity Substrate ${bundledVersion ||
    //                 "(couldn't get version)"}`
    //             )
    //         )
    // );
// }

function getBinaryVersion(binaryPath) {
    return exec(`${binaryPath} --version`)
        .then(({ stdout, stderr }) => {
            if (stderr) throw new Error(stderr);
            return stdout.match(/v\d+\.\d+\.\d+/)[0];
        })
        .catch(error => console.warn(error.message));
}







// if (foundPath) {
//     // Bundled Parity Substrate was found, we check if the version matches the minimum requirements
//     getBinaryVersion(foundPath)
//         .then(version => {
//             if (!version) {
//                 console.log("Couldn't get bundled Parity Substrate version.");
//                 return downloadSubstrate();
//             }

//             if (!semver.satisfies(version, versionRequirement)) {
//                 console.log(
//                     'Bundled Parity Substrate %s is older than required version %s',
//                     version,
//                     versionRequirement
//                 );
//                 return downloadSubstrate();
//             } else {
//                 console.log(
//                     'Bundled Parity Substrate %s matches required version %s',
//                     version,
//                     versionRequirement
//                 );
//             }
//         })
//         .catch(e => {
//             console.error(e);
//             process.exit(1);
//         });
// } else {
//     // Bundled Parity wasn't found, we download the latest version
//     downloadSubstrate().catch(e => {
//         console.error(e);
//         process.exit(1);
//     });
// }
