export default {
  testEnvironment: "node",
  testMatch: ["**/src/test/**/*.test.js", "**/src/**/*.test.js"],
  moduleFileExtensions: ["js", "json"],
  transform: {},
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js"],
  preset: null,
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
