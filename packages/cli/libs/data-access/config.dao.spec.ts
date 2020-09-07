import { readConfig, defaultConfig } from "./config.dao";

jest.mock("./file.service", () => ({
  ensureDirExists: () => Promise.resolve(),
  readFile: () => Promise.resolve("{}"),
}));

describe("interacting with config files", () => {
  it("replaces non-existent values with default values", async () => {
    expect(await readConfig()).toEqual(defaultConfig);
  });
});
