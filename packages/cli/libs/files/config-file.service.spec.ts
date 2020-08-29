import { readConfig, defaultConfig } from "./config-file.service";

jest.mock("./file.service");

describe("interacting with config files", () => {
  it("replaces non-existent values with default values", async () => {
    require("./file.service").__setResponse(true);
    expect(await readConfig()).toEqual(defaultConfig);
  });
});
