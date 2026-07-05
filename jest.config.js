module.exports = {
  preset: 'react-native',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/harmony/',
    '/android/',
    '/ios/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@commons/(.*)$': '<rootDir>/packages/commons/$1/src',
    '^@core/(.*)$': '<rootDir>/packages/core/$1/src',
    '^@features/(.*)$': '<rootDir>/packages/features/$1/src',
    '^@ui/(.*)$': '<rootDir>/packages/ui/$1/src',
    '^react-native-webview$': '<rootDir>/__mocks__/react-native-webview.js',
    '^react-native-video$': '<rootDir>/__mocks__/react-native-video.js',
    '\\.(png|jpg|jpeg|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-ohos|react-native-webview|react-native-track-player|@reduxjs/toolkit|immer|react-redux|redux)/)',
  ],
};
