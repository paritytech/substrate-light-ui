const baseConfig = require('@polkadot/dev/config/jest');

module.exports = {
  ...baseConfig,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}
