import { readConfig } from "./config-file.service";

jest.mock("./file.service");

describe("interacting with config files", () => {
  it("reads a config", async () => {
    require("./file.service").__setResponse(true);
    expect(await readConfig()).toEqual({});
  });
});
