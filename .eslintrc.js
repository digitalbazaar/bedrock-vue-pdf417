module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    'digitalbazaar',
    'digitalbazaar/vue'
  ],
  parserOptions: {
    // this is required for dynamic import()
    ecmaVersion: 11
  },
};
