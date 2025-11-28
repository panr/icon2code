import type { Config } from "jest";

const jestConfig: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
  testPathIgnorePatterns: ["/node_modules/", ".visual.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverageFrom: ["./figma.d.ts", "src/**/*.ts", "!src/**/*.d.ts", "./node_modules/@figma"],
};

export default jestConfig;
