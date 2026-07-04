module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['packages/core/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*', '@ui/*', '@app/*'],
                message: 'Core blocks must not depend on feature modules, UI blocks, or app shell.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/features/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*', '@app/*'],
                message: 'Feature modules must not import other features or app shell.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/ui/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@features/*'],
                message: 'UI blocks must not depend on feature modules.',
              },
            ],
          },
        ],
      },
    },
  ],
};
