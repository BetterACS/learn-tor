import type { Config } from '@jest/types'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config.InitialOptions = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    transformIgnorePatterns: ['node_modules/(?!(jose)/)'], // Transpile `jose`
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Adjust this path if necessary
      },
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)

