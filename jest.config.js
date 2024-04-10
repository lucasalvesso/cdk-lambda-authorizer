module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/test/mock-secrets.ts"],
};
