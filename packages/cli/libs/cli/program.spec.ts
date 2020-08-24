import { createProgram } from "./program";

describe("the cli parser", () => {
  it("can be constructed", () => {
    expect(createProgram()).toBeDefined();
  });
});
