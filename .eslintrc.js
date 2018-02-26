const isProduction = process.env.NODE_ENV === 'production';

const off = 0;
const warn = 1;
const error = 2;

module.exports = {
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended',
    'airbnb'
  ],
  parser: 'babel-eslint',
  plugins: [
    'react'
  ],
  rules: {
    'comma-dangle': [error, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline'
    }],
    'import/no-unresolved': off,
    'import/extensions': off,
    'import/no-deprecated': warn,
    indent: off,
    'no-console': isProduction ? error : off,
    'no-param-reassign': off,
    'no-unused-vars': [error, { args: 'after-used', ignoreRestSiblings: false }],
    'object-curly-newline': [error, { consistent: true }],
    'prefer-spread': off,
    'react/no-typos': error,
    'react/jsx-filename-extension': [error, { extensions: ['.js', '.jsx'] }],
  },
  globals: {},
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
}
