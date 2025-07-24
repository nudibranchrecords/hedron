module.exports = {
  plugins: ['react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier',
    'plugin:storybook/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'import/no-named-as-default-member': 0,
    'import/order': 'error',
    'import/no-extraneous-dependencies': 'error',
    'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          '../*', // Disallow relative imports that go up a directory
          'src/*', // Disallow absolute imports starting with `src/` and enforce alias usage
        ],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
}
