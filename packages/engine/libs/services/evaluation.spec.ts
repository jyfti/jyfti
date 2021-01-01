import { evaluate, functions } from "./evaluation";

describe("the evaluation of json-e expressions", () => {
  it("evaluates an expression", () => {
    expect(evaluate({ var: "value" }, "${var}")).toEqual("value");
  });
  it("returns null if the expression is undefined", () => {
    expect(evaluate({}, undefined)).toEqual(null);
  });

  it("finds an element in an array", () => {
    expect(functions.find([{ field: "value" }], "field", "value")).toEqual({
      field: "value",
    });
  });
  it("returns undefined if an element is not contained in an array", () => {
    expect(functions.find([{ field: "value" }], "field", "other")).toEqual(
      undefined
    );
  });
});
