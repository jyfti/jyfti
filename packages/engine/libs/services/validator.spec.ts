import { Inputs, JsonSchema } from "../types";
import { validateInputs } from "./validator";

describe("validation", () => {
  it("validates a map of schemas against a map of inputs", () => {
    const schemaMap: Record<string, JsonSchema> = {
      a: {
        type: "string",
      },
      b: {
        type: "number",
      },
    };
    const inputs: Inputs = {
      a: "abc",
      b: 42,
      c: ["def"],
    };
    expect(validateInputs(inputs, schemaMap)).toEqual({});
  });
});
