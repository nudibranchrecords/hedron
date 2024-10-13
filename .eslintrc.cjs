module.exports = {
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
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      // Add the typescript resolver here
      typescript: {
        // Point to the tsconfig file to resolve paths properly
        project: ['./tsconfig.web.json', './tsconfig.node.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
