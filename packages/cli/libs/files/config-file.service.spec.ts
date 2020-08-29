import { readConfig, defaultConfig } from "./config-file.service";

jest.mock("./file.service", () => ({
  ensureDirExists: () => Promise.resolve(),
  readJson: () => Promise.resolve({}),
}));

describe("interacting with config files", () => {
  it("replaces non-existent values with default values", async () => {
    expect(await readConfig()).toEqual(defaultConfig);
  });
});
