/* eslint-disable */
const { defaults } = require("jest-config");

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  collectCoverage: true,
  collectCoverageFrom: ["./libs/**/*.ts"],
  roots: ["./libs"],
  clearMocks: true,
};
