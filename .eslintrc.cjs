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
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'import/no-named-as-default-member': 0,
    'import/order': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        includeInternal: false,
        includeTypes: false,
        packageDir: ['.', '../..'], // Allow imports from the root package.json
      },
    ],
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
        project: [
          './packages/*/tsconfig.json',
          './packages/desktop/tsconfig.web.json',
          './packages/desktop/tsconfig.node.json',
        ],
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['packages/*/src', 'packages/desktop/src'],
      },
    },
  },
  overrides: [
    {
      files: [
        'packages/desktop/src/main/**/*',
        'packages/desktop/src/preload/**/*',
        'packages/desktop/src/shared/**/*',
        'packages/desktop/electron.vite.config.*',
      ],
      settings: {
        'import/resolver': {
          typescript: {
            project: './packages/desktop/tsconfig.node.json',
            alwaysTryTypes: true,
          },
        },
      },
    },
    {
      files: ['packages/desktop/src/renderer/**/*', 'packages/desktop/src/stories/**/*'],
      settings: {
        'import/resolver': {
          typescript: {
            project: './packages/desktop/tsconfig.web.json',
            alwaysTryTypes: true,
          },
        },
      },
    },
  ],
}
