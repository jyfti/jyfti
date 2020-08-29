import { readWorkflowSchemaOrTerminate } from "./workflow-schema.service";

jest.mock("./file.service", () => ({
  readJson: jest.fn(() => Promise.resolve({})),
}));

describe("interacting with workflow schemas", () => {
  it("reads a workflow schema and does not terminate if it exists", async () => {
    expect(await readWorkflowSchemaOrTerminate()).toEqual({});
  });

  it("reads a workflow schema and terminates if it does not exist", async () => {
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
    require("./file.service").readJson.mockImplementation(() =>
      Promise.reject()
    );
    await readWorkflowSchemaOrTerminate();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
