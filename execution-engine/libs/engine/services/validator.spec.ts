import { validateSchemaMap } from "./validator";
import { SchemaMap, Inputs } from "../types";

describe("validation", () => {
  it("validates a map of schemas against a map of inputs", () => {
    const schemaMap: SchemaMap = {
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
    expect(validateSchemaMap(schemaMap, inputs)).toEqual({});
  });
});
