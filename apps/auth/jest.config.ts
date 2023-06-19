import type { Config } from 'jest';

const config: Config = {
  displayName: 'auth',
  preset: '@shelf/jest-mongodb',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@app/common(|/.*)$': '<rootDir>/../../libs/common/src/$1',
  },
  testMatch: ['**/**/**/**/*.steps.ts'],
};

export default config;
