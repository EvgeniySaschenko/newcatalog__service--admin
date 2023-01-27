module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // 'plugin:vue/vue3-essential',
    // 'eslint:recommended',
    // '@vue/typescript/recommended', // -
    // 'plugin:prettier/recommended',
    // 'plugin:@typescript-eslint/recommended', 
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    // "@vue/prettier",
    // "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'off',
    'no-unused-vars': 'warn',
    'unicorn/error-message': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    eqeqeq: 'warn',
    'no-var': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
