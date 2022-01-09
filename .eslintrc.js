module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    uni: true,
    plus: true,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:vue/recommended'
  ],
  plugins: ['vue'],
  rules: {
    'no-undef': 'error',
    'no-unused-vars': 'off',
    'no-dupe-keys': 'warn',
    'no-async-promise-executor': 'off',
    'no-debugger': 'off',
    'no-mixed-spaces-and-tabs':'off'
  },
}
