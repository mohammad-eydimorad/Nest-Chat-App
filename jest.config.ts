import type { Config } from 'jest';

const config: Config = {
  preset: '@shelf/jest-mongodb',
  verbose: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  projects: [
    '<rootDir>/apps/auth/jest.config.ts',
    '<rootDir>/apps/chat/jest.config.ts',
  ],
};

export default config;
