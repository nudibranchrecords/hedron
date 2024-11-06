module.exports = {
  overrides: [
    {
      files: ['*.js', '*.ts', '*.jsx', '*.tsx', '*.css'], // Apply to specific file types if needed
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
}
