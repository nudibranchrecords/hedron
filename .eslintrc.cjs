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
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          '../*', // Disallow relative imports that go up a directory
          './*', // Optionally disallow relative imports within the same directory
          '!./*.module.css', // allow relative import of CSS module files
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
        project: ['./tsconfig.web.json', './tsconfig.node.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
