module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'semistandard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.json'
    ]
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // FIXME Remove all these rules!
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
