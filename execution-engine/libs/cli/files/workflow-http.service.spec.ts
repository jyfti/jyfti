import {
  extractWorkflowName,
  readWorkflowOrTerminate,
} from "./workflow-http.service";
import { Config } from "../types/config";

jest.mock("bent");

describe("interacting with workflows via http", () => {
  it("extracts a workflow name from a url", () => {
    expect(
      extractWorkflowName("https://localhost:8080/group/my-workflow.json")
    ).toEqual("my-workflow");
  });
});
